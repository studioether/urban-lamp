import { ConfigModuleOptions } from "@nestjs/config";

const configuration: ConfigModuleOptions = {
    isGlobal: true,
    expandVariables: true,
    envFilePath: ['.env', '.env.local.production'],
    load: [() => ({
        database: {
            // url: process.env.DATABASE_URL
            port: parseInt(process.env.PORT, 10) || 4000,
            url: process.env.POSTGRES_PRISMA_URL,
            directUrl: process.env.POSTGRES_URL_NON_POOLING,
            token: process.env.POSTGRES_URL
        }
    })]
}


export default configuration