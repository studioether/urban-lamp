import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { User } from "src/user/user.entity";




const config: PostgresConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres", //might be 1234
    database: "lampDB",
    entities: [User],
    synchronize: true
}


export default config