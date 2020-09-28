import sequelize from 'sequelize'
export const Sequelize = sequelize.Sequelize
export const DataTypes = sequelize.DataTypes
export const QueryTypes = sequelize.QueryTypes
export const Op = sequelize.Op;

export class Orm extends Sequelize {

  /**
   * Constructor
   *
   * @param config
   */
  constructor(config) {
    super(config.database.name, config.database.user, config.database.password, {
      host: config.database.host,
      dialect: config.database.dialect,
      pool: {
        max: config.database.pool.max,
        min: config.database.pool.min,
        acquire: config.database.pool.acquire,
        idle: config.database.pool.idle
      }
    });
  }
}
