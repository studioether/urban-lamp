import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { UserEntity } from "src/user/entities/user.entity";




const config: PostgresConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres", //might be 1234
    database: "lampDB",
    entities: [UserEntity],
    synchronize: true
}


export default config