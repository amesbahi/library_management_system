'use strict';
module.exports = function(sequelize, DataTypes) {
  var Book = sequelize.define('Book', {
    id: { type: DataTypes.INTEGER, primaryKey: true},
    title: { type: DataTypes.STRING, validate: { notEmpty: {msg: 'You must add a title!'} } },
    author: { type: DataTypes.STRING, validate: { notEmpty: { msg: 'You must add an author!' } } },
    genre: { type: DataTypes.STRING, validate: { notEmpty: { msg: 'You msut add a genre!' } } },
    first_published: DataTypes.INTEGER
  });
  Book.associate = function(models) {
    // associations can be defined here
    Book.hasOne(models.Loan, { foreignKey: "book_id" });
  };
  return Book;
};