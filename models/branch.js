module.exports = (sequelize, Sequelize) => {
    const branch = sequelize.define("branch", { // 엔티티 생성
        branchID: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        branchName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false
        },
        manager: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
    {
        tableName: "branch",
        timestamps: false
    });
    return branch;
}