const Sequelize = require('sequelize');
const { mysql} =  require('../config');
const { database, host, port, username, password, dialect} = mysql;
const sequelize = new Sequelize(
    database,
    username,
    password,
  {
  host,
  dialect,
  timezone: '+08:00',
});


module.exports = sequelize;
