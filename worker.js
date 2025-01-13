import Queue from 'bull';
import Match from './models/match.js';
import websocket from './config/websocket.js';
import { DEV } from './utils/constants.js';

const options = DEV ? {
  host: 'localhost',
  port: 6379,
}: {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
}

export const matchEndQueue = new Queue('matchEndQueue', options);

matchEndQueue.process(async (job) => {
  const { matchId } = job.data;
  console.log('dispatching game end')
  try {
    const match = await Match.findById(matchId);
    if (match) {
      websocket.gameEnd(match.id.toString());
    }
  } catch (error) {
    console.error(`Error processing match end for match ${matchId}:`, error);
  }
});

console.log('Match end worker is running.');
