import multer from "multer";
import os from "os";
import path from "path";
import { v7 as uuid } from "uuid";

export function getIPAddress() {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        for (const net of networkInterfaces[interfaceName]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'IP address not found';
}

export default function upload(folderPath) {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `assets/imgs/uploads/${folderPath}`);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            console.log(ext);

            const uniqueSuffix = uuid();
            const filename = ext === '.svg' ? `${uniqueSuffix}${ext}` : `${uniqueSuffix}`;

            cb(null, filename);
        }
    });

    return multer({ storage });
}
