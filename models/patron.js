'use strict';
module.exports = function(sequelize, DataTypes) {
  var Patron = sequelize.define('Patron', {
    id: { type: DataTypes.INTEGER, primaryKey: true},
    first_name: { type: DataTypes.STRING, validate: { notEmpty: {msg: 'Please enter a first name!' } } },
    last_name: { type: DataTypes.STRING, validate: { notEmpty: {msg: 'Please enter a last name!' } } },
    address: { type: DataTypes.STRING, validate: { notEmpty: {msg: 'Please enter an address!' } } },
    email: { type: DataTypes.STRING, validate: { notEmpty: {msg: 'Please enter an email!'} } },
    library_id: { type: DataTypes.STRING, validate: { notEmpty: {msg: 'Please enter a library id!'} } },
    zip_code: { type: DataTypes.INTEGER, validate: { notEmpty: {msg: 'Please enter a zip code!' } } }
  });
  Patron.associate = function(models) {
    // associations can be defined here
    Patron.hasMany(models.Loan, { foreignKey: "patron_id" });
  };
  return Patron;
};