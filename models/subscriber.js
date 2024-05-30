module.exports = (sequelize, Sequelize) => {
    const subscriber = sequelize.define("subscriber", { // 엔티티 생성
        name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            primaryKey: true
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
    const machine = sequelize.define("machine", { // 엔티티 생성
            name: {
                type: Sequelize.STRING,
                primaryKey: true
            },
            state: {
                type: Sequelize.STRING
            },
            zipCode: {
                type: Sequelize.INTEGER
            }
        },
        {
            tableName: "machine",
            timestamps: false
        });
    return {
        Machine: machine,
        Subscriber: subscriber
    };
};