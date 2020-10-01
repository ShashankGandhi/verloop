module.exports = function (sequelize, DataTypes) {
  var Story = sequelize.define('Story', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true
    }
    // createdAt and updatedAt are created automatically
  });

  Story.associate = function (models) {
    // indicates 1:Many Relationship between Story and paragraphs
    Story.hasMany(models.Paragraph);
  };
  return Story;
};


/**
 * 1 story has title and paragraphs
 * title has 2 words
 * story has 7 paragraphs
 * each paragraph has 10 sentences
 * each sentence has 15 words
 */
