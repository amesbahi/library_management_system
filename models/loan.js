'use strict';
module.exports = function(sequelize, DataTypes) {
  var Loan = sequelize.define('Loan', {
    id: { type: DataTypes.INTEGER, primaryKey: true},
    book_id: { type: DataTypes.INTEGER , validate: { notEmpty: {msg: 'You must add a book id!'} } },
    patron_id: { type: DataTypes.INTEGER, validate: { notEmpty: {msg: 'You must add a patron id!'} } },
    loaned_on: { type: DataTypes.DATE , validate: { notEmpty: {msg: 'You must add a loaned on date!'} } },
    return_by: { type: DataTypes.DATE , validate: { notEmpty: {msg: 'You must add a return by date!'} } },
    returned_on: DataTypes.DATE
  });
  Loan.associate = function(models) {
    // associations can be defined here
    Loan.belongsTo(models.Book, { foreignKey: "book_id" });
    Loan.belongsTo(models.Patron, { foreignKey: "patron_id" });
  };
  return Loan;
};