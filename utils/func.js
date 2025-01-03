import multer from "multer";
import os from "os";

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


export default function upload(path) {
    return multer({ dest: `assets/imgs/uploads/${path}` });
}