module.exports = (sequelize, DataTypes) => {
    const qnaChat = sequelize.define(
        "qnaChat",
    {
        idx: {
            type:DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement : true
        },
        chatting: {
            type:DataTypes.STRING(255),
            allowNull: false,
        },
        senderEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'subscriber',
                key: 'email'
            }
        },
        receiverEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'subscriber',
                key: 'email'
            }
        },
        branchID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'branch',
                key: 'branchID'
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
        }
    },
    {
      freezeTableName: true,
      timestamps: false,
      comment: '채팅로그',
    }
    );
  return qnaChat;
};