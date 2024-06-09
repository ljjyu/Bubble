module.exports = (sequelize, Sequelize) => {
    const notice = sequelize.define("notice", { // 엔티티 생성
        noticeNumber: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
	},
	title: {
            type: Sequelize.STRING
        },
        writeDate: {
            type: Sequelize.DATE
        },
        contents: {
            type: Sequelize.STRING
        }
    },
    {
        tableName: "notice",
        timestamps: false
    });
    return notice;
}

