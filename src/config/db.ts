import {Sequelize} from 'sequelize';
import config from '../config/index';
const sequelize = new Sequelize(config.database);

export default sequelize;
