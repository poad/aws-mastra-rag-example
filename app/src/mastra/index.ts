
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { PgVector } from '@mastra/pg';
 
import { researchAgent } from './agents/';
 
// Initialize Mastra instance
const pgVector = new PgVector(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/vector-store`);
export const mastra = new Mastra({
  agents: { researchAgent },
  vectors: { pgVector },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
