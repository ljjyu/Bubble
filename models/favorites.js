module.exports = (sequelize, Sequelize) => {
    const favorites = sequelize.define("favorites", { // 엔티티 생성
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        reviewID: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: "favorites",
        timestamps: false,
        indexes: [{
            unique: true,
            fields: ['userName', 'reviewID']
        }]
    });
    return favorites;
}