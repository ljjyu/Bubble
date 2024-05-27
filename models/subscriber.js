module.exports = (sequelize, Sequelize) => {
    const subscriber = sequelize.define("subscriber", { // 엔티티 생성
        name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        zipCode: {
            type: Sequelize.INTEGER
        }
    },
    {
        timestamps: false
    });
    return subscriber;
}