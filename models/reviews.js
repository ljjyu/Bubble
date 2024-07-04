module.exports = (sequelize, Sequelize) => {
    const Review = sequelize.define("Review", { // 엔티티 생성
         id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
         },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        review: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        rating: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
	    field: 'created_at' // 데이터베이스 필드 이름
        },
        subscriberName: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'subscriber',
                key: 'name'
            }
        }
    },
    {
        tableName: "reviews",
        timestamps: false
    });
    return Review;
}
