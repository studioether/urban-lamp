import { DataSourceOptions, DataSource } from "typeorm";


export const dataSourceOptions: DataSourceOptions = {
    type: "postgres",
    database: "lamp",
    host: "localhost",
    port: 5432,
    username: "postgres", //?might be postgres
    password: "1234",
    entities: ["dist/src/**/*.js"],
    synchronize: false,
    migrations: ["dist/db/migrations/*.entity.js"]
}


const dataSource = new DataSource(dataSourceOptions)
export default dataSource