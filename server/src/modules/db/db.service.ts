import { Injectable } from '@nestjs/common';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as dotenv from 'dotenv';
dotenv.config();
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '../shared/schema';
neonConfig.webSocketConstructor = ws as any;
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set');
}
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: schema as any });
@Injectable()
export class DbService {
    db = db;
    pool = pool;
}