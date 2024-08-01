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
            type: Sequelize.STRING,
            unique: true
        },
        address: {
            type: Sequelize.STRING
        },
	resetPasswordToken: {
            type: Sequelize.STRING
        },
        resetPasswordExpires: {
            type: Sequelize.DATE
        }
    },
    {
        tableName: "subscriber",
        timestamps: false
    });
    return subscriber;
}
