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
db.reservation = require("./reservation.js")(sequelize, Sequelize);
db.notice = require("./notice.js")(sequelize, Sequelize);
db.Review = require("./reviews.js")(sequelize, Sequelize);
db.branch = require("./branch.js")(sequelize, Sequelize);

// 모델 간의 관계 정의 (Associations)
db.branch.hasMany(db.Review, { foreignKey: 'branchID', as: 'reviews' });
db.Review.belongsTo(db.branch, { foreignKey: 'branchID', as: 'branch' });

db.machine.hasMany(db.reservation, { foreignKey: 'machineID', as: 'reservation'});
db.reservation.belongsTo(db.machine, { foreignKey: 'machineID', as: 'machine' });

db.branch.belongsTo(db.subscriber, { foreignKey: 'name', as: 'subscriber' });
db.subscriber.belongsTo(db.branch, { foreignKey: 'name', as: 'branch2' });

db.machine.belongsTo(db.branch, { foreignKey: 'branchID', as: 'branch3' });
db.branch.hasMany(db.machine, { foreignKey: 'branchID', as: 'machine2' });

db.reservation.belongsTo(db.subscriber, { foreignKey: 'name', as: 'subscriber2' });
db.subscriber.hasMany(db.reservation, { foreignKey: 'subscriberName', as: 'reservation2' });

db.Review.belongsTo(db.subscriber, { foreignKey: 'name', as: 'subscriber3' });
db.subscriber.hasMany(db.Review, { foreignKey: 'subscriberName', as: 'reviews1' });

db.notice.belongsTo(db.subscriber, { foreignKey: 'branchName', as: 'subscriber4' });
db.subscriber.hasMany(db.notice, { foreignKey: 'subscriberName', as: 'reviews2' });
module.exports = db;
