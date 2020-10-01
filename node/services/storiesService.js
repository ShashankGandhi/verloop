const models = require('../models');
const _ = require('underscore');
const MAX_WORDS_IN_A_TITLE_COUNT = 2;
const MAX_PARAGRAPH_IN_A_STORY_COUNT = 7;
const MAX_SENTENCES_IN_A_PARAGRAPH_COUNT = 10;
const MAX_WORDS_IN_A_SENTENCE_COUNT = 15;
const SORT_ENUM_VALUES = {
  'created_at': 'createdAt',
  'updated_at': 'updatedAt',
  'title': 'title'
};


const addWordsToStories = (body) => {
  // check if word exists in body
  if (!body || !body.word.trim()) {
    return Promise.reject({
      status: 400,
      data: { error: 'No word present in request' }
    })
  }

  // check if multiple words are sent
  if (body && body.word.split(" ").length > 1) {
    return Promise.reject({
      status: 400,
      data: { error: 'multiple words sent' }
    })
  }

  // all boundary conditions eliminated
  // now add word in story(title/sentence)

  return models.Story.findOne({
    attributes: [
      'id',
      'title',
      ['createdAt', 'created_at'],
      ['updatedAt', 'updated_at']
    ],
    include: [{ model: models.Paragraph }],
    order: [['id', 'DESC']],
    limit: 1,
  })
    .then((story) => {
      // initial condition, first time insert if story doesn't exist then create one 
      // or the story is filled with max word count
      let multipleParagraphs = (story && story.Paragraphs && story.Paragraphs.length > 0);
      let lastParagraph = multipleParagraphs ? story.Paragraphs[story.Paragraphs.length - 1] : null;
      let multipleSentences = (lastParagraph && lastParagraph.sentences && lastParagraph.sentences.length > 0);
      let lastSentence = multipleSentences ? lastParagraph.sentences[lastParagraph.sentences.length - 1] : null;

      if (
        !story ||
        (
          multipleParagraphs &&
          story.Paragraphs.length === MAX_PARAGRAPH_IN_A_STORY_COUNT &&
          multipleSentences &&
          lastParagraph &&
          lastParagraph.sentences.length === MAX_SENTENCES_IN_A_PARAGRAPH_COUNT &&
          lastSentence &&
          lastSentence.split(' ').length === MAX_WORDS_IN_A_SENTENCE_COUNT
        )
      ) {
        return createStory(body);
      }

      // check is title is complete
      if (story.title && story.title.split(' ').length < MAX_WORDS_IN_A_TITLE_COUNT) {
        return appendTitle(story, body);
      }

      // check if any paragraphs are there
      // condition to add the first paragraph
      // or when 10 sentences with 150 words are filled in last paragraph
      if (
        _.isEmpty(story.Paragraphs) ||
        (
          lastParagraph &&
          lastParagraph.word_count === (MAX_WORDS_IN_A_SENTENCE_COUNT*MAX_SENTENCES_IN_A_PARAGRAPH_COUNT)
        )
      ) {
        return addParagraphs(story, body);
      }

      // when last sentence has words < 15 hence fill it first
      if (
        lastParagraph &&
        lastSentence &&
        lastSentence.split(' ').length < MAX_WORDS_IN_A_SENTENCE_COUNT
      ) {
        return addWordInSentence(story, lastParagraph, body);
      }
      
      // when last sentence has words =15 and total sentences < 10
      // hence adding a new sentence in a paragraph
      if (
        lastParagraph && 
        lastParagraph.sentences.length < MAX_SENTENCES_IN_A_PARAGRAPH_COUNT &&
        lastSentence.split(' ').length === MAX_WORDS_IN_A_SENTENCE_COUNT
      ) {
        return addSentenceInParagraph(story, lastParagraph, body);
      }

      
    })
    .catch((err) => {
      console.error('error occurred while adding word', err);
      return Promise.resolve({
        status: 500,
        data: {
          message: 'internal failure',
          error: err,
        },
      });
    });
};

/**
 * This creates a new story by just adding word to title
 * @param {Object} body 
 */
const createStory = (body) => {
  return models.Story.create({
    title: body.word,
  })
  .then((data) => {
    return Promise.resolve({
      status: 201,
      data: {
        id: data.id,
        title: data.title,
        // when creating a new story, we add title and no sentence is created
        current_sentence: '',
      }
    })
  });
}

/**
 * This updates a story by just adding word to title
 * @param {Object} story 
 * @param {Object} body 
 */
const appendTitle = (story, body) => {
  story.title = story.title + ' ' + body.word;
  return story.save()
  .then((data) => {
    return Promise.resolve({
      status: 200,
      data: {
        id: data.id,
        title: data.title,
        current_sentence: data.current_sentence ? data.current_sentence : '',
      }
    });
  });
}

/**
 * This add a paragraph against a story and adds a word in sentence JSON field
 * @param {Object} story 
 * @param {Object} body  
 */
const addParagraphs = (story, body) => {
  let sentence = body.word;
  return models.Paragraph.create({
    sentences: [sentence],
    StoryId: story.id,
    word_count: 1
  })
  .then((data) => {
    return Promise.resolve({
      status: 200,
      data: {
        id: data.id,
        title: data.title,
        current_sentence: sentence,
      }
    });
  });
};

/**
 * This appends word in a sentence for a paragraph
 * @param {Object} story
 * @param {Object} lastParagraph 
 * @param {Object} body  
 */
const addWordInSentence = (story, lastParagraph, body) => {;
  let sentencesArray = lastParagraph.sentences;
  let lastSentence = sentencesArray.pop();
  lastSentence = lastSentence + ' ' + body.word;
  sentencesArray.push(lastSentence);
  return models.Paragraph.update(
    { 
      sentences: sentencesArray,
      word_count: lastParagraph.word_count + 1
    },
    { where: { id: lastParagraph.id}}
  )
  .then((data) => {
    return Promise.resolve({
      status: 200,
      data: {
        id: story.id,
        title: story.title,
        current_sentence: lastSentence,
      }
    });
  });
}

/**
 * This add a new sentence for a paragraph
 * @param {Object} story
 * @param {Object} lastParagraph 
 * @param {Object} body  
 */

const addSentenceInParagraph = (story, lastParagraph, body) => {
  let sentencesArray = lastParagraph.sentences;
  sentencesArray.push(body.word);
  return models.Paragraph.update(
    { 
      sentences: sentencesArray,
      word_count: lastParagraph.word_count + 1
    },
    { where: { id: lastParagraph.id}}
  )
  .then((data) => {
    return Promise.resolve({
      status: 200,
      data: {
        id: story.id,
        title: story.title,
        current_sentence: body.word,
      }
    });
  });
};

/**
 * Get details against a particular story
 * @param {Number} storyId 
 */
const getSingleStory = (storyId) => {
  return models.Story.findOne({
    where: { id: storyId },
    attributes: [
      'id',
      'title',
      ['createdAt', 'created_at'],
      ['updatedAt', 'updated_at']
    ],
    include: [
      {
        model: models.Paragraph,
        attributes: ['sentences']
      }
    ],
  })
    .then((querryValue) => {
      return Promise.resolve({
        status: 200,
        data: {
          id: querryValue.id,
          title: querryValue.title,
          created_at: querryValue.created_at,
          updated_at: querryValue.updated_at,
          paragraphs: querryValue.Paragraphs,
        },
      });
    })
    .catch((err) => {
      console.error('error occurred while retreiving story', err);
      return Promise.resolve({
        status: 500,
        data: {
          message: 'internal failure',
          error: err,
        },
      });
    });
};

/**
 * Get all stories according the request query params, possible values are
 * limit
 * offset
 * order
 * sort
 * @param {Object} query 
 */
const getAllStories = (query) => {
  let limit = query.limit ? parseInt(query.limit) : 100;
  let offset = query.offset ? parseInt(query.offset) : 0;
  let order = query.order ? query.order : 'asc';
  let sort = query.sort ? SORT_ENUM_VALUES[query.sort] : 'createdAt';
  return models.Story.findAll({
    attributes: [
      'id',
      'title',
      ['createdAt', 'created_at'],
      ['updatedAt', 'updated_at']
    ],
    limit: limit,
    offset: offset,
    order: [[sort, order]]
  })
    .then((querryValue) => {
      return Promise.resolve({
        status: 200,
        data: {
          limit,
          offset,
          count: querryValue.length,
          results: querryValue
        }
      });
    })
    .catch((err) => {
      console.error('error occurred while retreiving all stories', err);
      return Promise.resolve({
        status: 500,
        data: {
          message: 'internal failure',
          error: err,
        },
      });
    });
};

module.exports = {
  addWordsToStories,
  getSingleStory,
  getAllStories
};
