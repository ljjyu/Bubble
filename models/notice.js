module.exports = (sequelize, Sequelize) => {
    const notice = sequelize.define("notice", { // 엔티티 생성
        noticeNumber: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
	    },
	    title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        contents: {
            type: Sequelize.STRING,
            allowNull: false
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        subscriberName: {
            type: Sequelize.STRING,
            references: {
                model: 'subscriber',
                key: 'branchName'
            }
        }
    },
    {
        tableName: "notice",
        timestamps: false
    });
    return notice;
}

