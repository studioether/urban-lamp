import { ConfigModuleOptions } from "@nestjs/config";

const configuration: ConfigModuleOptions = {
    isGlobal: true,
    expandVariables: true,
    envFilePath: ['.env', '.env.production'],
    load: [() => ({
        database: {
            // url: process.env.DATABASE_URL
            url: process.env.POSTGRES_PRISMA_URL
        }
    })]
}


export default configuration