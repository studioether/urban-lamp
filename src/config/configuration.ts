import { ConfigModuleOptions } from "@nestjs/config";

const configuration: ConfigModuleOptions = {
    isGlobal: true,
    expandVariables: true,
    envFilePath: ['.env', '.env.production'],
    load: [() => ({
        database: {
            // url: process.env.DATABASE_URL
            url: process.env.POSTGRES_PRISMA_URL,
            directUrl: process.env.POSTGRES_URL_NON_POOLING,
            token: process.env.POSTGRES_URL
        }
    })]
}


export default configuration