module.exports = (sequelize, Sequelize) => {
    const reservation = sequelize.define("reservation", {
        reservationNumber: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        machineType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        reservationDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        machineNum: {
             type: Sequelize.STRING,
             allowNull: false
        },
        subscriberName: {
             type: Sequelize.STRING,
             allowNull: false
        },
        created_at: {
             type: Sequelize.DATE,
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
