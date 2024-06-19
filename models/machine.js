module.exports = (sequelize, Sequelize) => {
    const machine = sequelize.define("machine", { // 엔티티 생성
        name: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        state: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
    {
        tableName: "machine",
        timestamps: false
    });
    return machine;
}