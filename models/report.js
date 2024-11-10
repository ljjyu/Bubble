module.exports = (sequelize, Sequelize) => {
    const Report = sequelize.define("Report", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        reviewID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Review',
                key: 'id'
            }
        },
        category: {
            type: Sequelize.STRING,
            allowNull: false
        },
        reason: {
            type: Sequelize.STRING,
            allowNull: true
        },
        reportedBy: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'subscriber',
                key: 'name'
            }
        },
        branchID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Branch',
                key: 'id'
            }
        },
        reported_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            field: 'reported_at'
        }
    }, {
        tableName: 'reports',
        timestamps: false
    });

    Report.associate = function(models) {
        Report.belongsTo(models.Review, {
            foreignKey: 'reviewID',
            as: 'review'
	   
        });
        Report.belongsTo(models.Branch, {
            foreignKey: 'branchID',
            as: 'branch'
        });
        Report.belongsTo(models.User, {
            foreignKey: 'reportedBy',
            as: 'reporter'
        });
    };

    return Report;
};

