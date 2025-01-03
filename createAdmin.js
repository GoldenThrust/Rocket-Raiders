import mongodb, { redis } from "./config/db.js";
import mail from "./config/mail.js";
import Admin from "./models/admin.js";
import { v4 as uuid } from "uuid";
mongodb.run().then(() => {
    redis.run().then((req, res) => {
        process.stdout.write('Enter your Email Address:');
        process.stdin.on('data', async (data) => {
            const email = data.toString().trim();
            const admin = new Admin({ email });
            const crypto = uuid();
            await mail.sendAdminActivationLink(admin, crypto).then(async ()=> {
                await redis.set(`admin_${crypto}`, email, 60 * 60)
                await admin.save();
                process.exit();
            });
        });
    });
});

