import Queue from 'bull';
import Match from './models/match.js';
import websocket from './config/websocket.js';
import { DEV } from './utils/constants.js';

const options = {
  redis: {
    url: process.env.REDIS_URL
  },
}

export const matchEndQueue = new Queue('matchEndQueue', options);

matchEndQueue.process(async (job) => {
  const { matchId } = job.data;
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
