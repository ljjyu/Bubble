module.exports = (sequelize, Sequelize) => {
    const machine = sequelize.define("machine", { // 엔티티 생성
        machineID: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type: {
            type: Sequelize.ENUM('washer', 'dryer'),
            allowNull: false
        },
        state: {
            type: Sequelize.ENUM('available', 'in_use', 'needs_repair'),
            allowNull: false,
            defaultValue: 'available'
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
        tableName: "machine",
        timestamps: false
    });
    nachine.belongsTo(models.branch, {
        foreignKey: 'branchID',
        as: 'branch'
    });
    return machine;
}