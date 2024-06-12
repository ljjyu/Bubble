module.exports = (sequelize, Sequelize) => {
    const reservation = sequelize.define("reservation", {
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
        },
        createdAt: {
             type: DataTypes.DATE,
             allowNull: false,
             defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    },
    {
        tableName: "reservation",
        timestamps: false
    });
    return reservation;
}
// 수정 금지 !!
