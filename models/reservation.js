module.exports = (sequelize, Sequelize) => {
    const reservation = sequelize.define("reservation", { // 엔티티 생성
        reservationNumber: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        reservationDate: {
            type: Sequelize.DATE
        },
        usageTime: {
            type: Sequelize.STRING,
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
