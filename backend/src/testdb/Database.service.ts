import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
    constructor(private dataSource: DataSource) { }

    async onModuleInit() {
        try {
            if (this.dataSource.isInitialized) {
                console.log('✅ DB connected successfully');
            } else {
                await this.dataSource.initialize();
                console.log('✅ DB initialized');
            }
        } catch (error) {
            console.error('❌ DB connection failed:', error);
        }
    }
}
