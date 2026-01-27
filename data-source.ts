import 'dotenv-flow/config';
import { DataSource } from 'typeorm';
import { configuration } from './src/config';

const db = configuration().database;

export default new DataSource({
  type: 'postgres',
  host: db.host,
  port: db.port,
  username: db.user,
  password: db.pass,
  database: db.name,
  entities: [__dirname + '/src/common/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/src/migrations/*.ts'],
  synchronize: false,
});
