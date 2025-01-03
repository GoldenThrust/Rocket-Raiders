import Queue from 'bull';
import { DEV } from './utils/constants';


export const GameQueue = DEV ? new Queue('GameQueue') : new Queue('GameQueue', {
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    }
});

GameQueue.process(async (job) => {
    const { matchId } = job.data;

    const timeId = setInterval(()=> {

        clearInterval(timeId);
    }, 5000)
})