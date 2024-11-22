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
            try{
                await this.$connect()
            }catch(error){
                console.error('error details', error)
            }
        }
}
