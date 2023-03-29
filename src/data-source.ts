import "reflect-metadata"
import {DataSource, DataSourceOptions} from "typeorm"

console.log(__dirname)
export const AppDataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL ?? 'postgres://test:test@localhost:5432/test',
    synchronize: false,
    logging: true,
    entities: [__dirname + "/entity/*.{js,ts}"],
    migrations: [__dirname + "/migration/*.ts"],
    subscribers: [__dirname + "/subscribers/*.ts"],
};

export const AppDataSource = new DataSource(AppDataSourceOptions)
