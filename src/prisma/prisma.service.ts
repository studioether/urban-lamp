import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
    constructor(private configService: ConfigService) {
        const dbUrl = configService.get<string>('database.url')
        console.log('vercel postgres configured: ', dbUrl ? 'present': 'missing')
        super({
            datasources: {
                db: {
                    url: configService.get<string>('database.url')
                }
            },
            log: ['error','warn','info'],
        })
    }

    async onModuleInit() {
        let retries = 5
        while (retries > 0) {
            try{
                await this.$connect()
            }catch(error){
                console.error(`failed to connect to db. retires left:, ${retries}`)
                console.error('error details', error)
                retries--
                if(retries === 0){
                    throw error;
                }
                // console.error("Environment Check", {
                //     hasPrismaUrl: !!process.env.POSTGRES_PRISMA_URL,
                //     hasDirectUrl: !!process.env.PRISMA_URL_NON_POOLING,
                //     hasPoolingUrl: !!process.env.POSTGRES_URL
                // })
                await new Promise(resolve => setTimeout(resolve, 2000))
            }
        }
    }
}
