import { Sequelize } from "sequelize";
import config from "../config/index";
const sequelize = new Sequelize(
  config.database.name,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    dialect: config.database.dialect,
    port: config.database.port,
  }
);

export default sequelize;
