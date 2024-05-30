const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};
// 데이터베이스 연결을 위한 sequelize 인스턴스 생성
let sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.subscriber = require("./subscriber.js")(sequelize, Sequelize);
db.machine = require("./machine.js")(sequelize, Sequelize);
module.exports = db;
