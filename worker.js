import Queue from 'bull';
import Match from './models/match.js';
import websocket from './config/websocket.js';


export const matchEndQueue = new Queue('matchEndQueue');

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
