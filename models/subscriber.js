module.exports = (sequelize, Sequelize) => {
    const subscriber = sequelize.define("subscriber", { // 엔티티 생성
        name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        password: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        phoneNumber: {
             type: Sequelize.STRING
        },
        cardNumber: {
             type: Sequelize.STRING
        }
    },
    {
        tableName: "subscriber",
        timestamps: false
    });
    return subscriber;
}