module.exports = (sequelize, Sequelize) => {
    const reservation = sequelize.define("reservation", { // 엔티티 생성
        reservationNumber: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        machineType: {
            type: Sequelize.STRING,
        },
        reservationDate: {
            type: Sequelize.DATE
        },
        machineNum: {
             type: Sequelize.STRING
        }
    },
    {
        tableName: "reservation",
        timestamps: false
    });
    return reservation;
}
