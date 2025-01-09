import mongodb, { redis } from "./config/db.js";
import Rocket from "./models/rocket.js";

mongodb.run().then(() => {
    redis.run().then(async () => {
        const rockets = await Rocket.find({ name: { $ne: 'Rocket' } });
        for (const [i, rocket] of rockets.entries()) {
            rocket.price = Math.ceil(Math.random() * 10) * (i + 10);
            await rocket.save();
        }
    });
});