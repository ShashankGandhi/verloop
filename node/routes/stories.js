/**
 * Declarations
 */
const express = require('express');
const models = require('../models');
const _ = require('underscore');
// Define router
const router = express.Router();
const storiesService = require('../services/storiesService');

router.post('/add', (req, res) => {
  console.log('in /add', req.body)
  storiesService
    .addWordsToStories(req.body)
    .then((response) => res.status(response.status).json(response.data))
    .catch((error) => res.status(error.status).json(error.data));
});

// get story and paragraphs data for a specific story
router.get('/stories/:id', (req, res) => {
  storiesService
    .getSingleStory(req.params.id)
    .then((response) => res.status(response.status).json(response.data))
    .catch((error) => res.status(error.status).json(error.data));
});


// get story and paragraphs data for all stories
router.get('/stories/', (req, res) => {
  console.log('req.query=======', req.query)
  storiesService
    .getAllStories(req.query)
    .then((response) => res.status(response.status).json(response.data))
    .catch((error) => res.status(error.status).json(error.data));
});

module.exports = router;
