module.exports = (sequelize, Sequelize) => {
    const Branch = sequelize.define("Branch", { // 엔티티 생성
        branchID: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        branchName: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        manager: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'subscriber',
                key: 'name'
            }
        }
    },
    {
        tableName: "branch",
        timestamps: false
    });
    return Branch;
}