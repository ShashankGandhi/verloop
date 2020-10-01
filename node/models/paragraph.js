module.exports = function (sequelize, DataTypes) {
  var Paragraph = sequelize.define('Paragraph', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    sentences: {
      type: DataTypes.JSON,
      allowNull: true
    },
    word_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    }
    // createdAt and updatedAt are created automatically
  });

  Paragraph.associate = function (models) {
    // Foreign key of StoryId
    Paragraph.belongsTo(models.Story);
  };
  return Paragraph;
};
