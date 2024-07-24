module.exports = (sequelize, Sequelize) => {
    const qna = sequelize.define("qna", {
        qnaNumber: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: Sequelize.STRING,
            allowNull: false
        },
        answer: {
            type: Sequelize.STRING,
            allowNull: true
        },
        userEmail: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'subscriber',
                key: 'email'
            }
        },
        branchID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'branch',
                key: 'branchID'
            }
        }
    },
    {
        tableName: 'qna',
        timestamps: false
    });

    // 외부키 관계
    qna.belongsTo(sequelize.models.branch, {
        foreignKey: 'branchID',
        targetKey: 'branchID'
    });
    qna.belongsTo(sequelize.models.subscriber, {
        foreignKey: 'userEmail',
        targetKey: 'email'
    });

    return qna;
}