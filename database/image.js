const Sequelize = require('sequelize');
const sequelize = require('./start');
const Image = sequelize.define('image', {
  imgId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  imgUrl: {
    type: Sequelize.STRING
  },
});

module.exports = Image;
