module.exports = (sequelize, DataTypes) => {
    const TempSubscriber = sequelize.define("tempSubscriber", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.STRING
        },
        cardNumber: {
            type: DataTypes.STRING
        },
        branchName: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
        verificationCode: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        verificationExpires: {
            type: DataTypes.DATE,
            allowNull: true
        }
    });

    return TempSubscriber;
};
