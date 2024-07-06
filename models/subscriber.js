module.exports = (sequelize, Sequelize) => {
    const subscriber = sequelize.define("subscriber", { // 엔티티 생성
        name: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        role: {
            type: Sequelize.ENUM('user', 'admin'),
            allowNull: false,
            defaultValue: 'user'
        },
        phoneNumber: {
             type: Sequelize.STRING
        },
        cardNumber: {
             type: Sequelize.STRING
        },
        branchName: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        }
    },
    {
        tableName: "subscriber",
        timestamps: false
    });
    subscriber.hasMany(Sequelize.models.reservation, {
        as: 'reservation',
        foreignKey: 'subscriberName'
    });
    return subscriber;
}
