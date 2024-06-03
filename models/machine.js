module.exports = (sequelize, Sequelize) => {
    const machine = sequelize.define("machine", { // 엔티티 생성
        name: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        state: {
            type: Sequelize.STRING
        }
    },
    {
        tableName: "machine",
        timestamps: false
    });
    return machine;
}