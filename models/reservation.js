/*module.exports = (sequelize, Sequelize) => {
    const reservation = sequelize.define("reservation", { // 엔티티 생성
        reservationNumber: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        usageTime: {
            type: Sequelize.STRING,
        },
        reservationDate: {
            type: Sequelize.DATE
        },
        Location: {
             type: Sequelize.STRING
        }
    },
    {
        tableName: "reservation",
        timestamps: false
    });
    return reservation;
}*/

module.exports = (sequelize, Sequelize) => {
    const reservation = sequelize.define("reservation", {
        reservationNumber: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        usageTime: {
            type: Sequelize.STRING,
        },
        reservationDate: {
            type: Sequelize.DATE
        },
        Location: {
             type: Sequelize.STRING
        }
    },
    {
        tableName: "reservation",
        timestamps: false
    });
    return reservation;
}
