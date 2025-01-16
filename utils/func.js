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
            const uniqueSuffix = uuid();
            const filename = ext === '.svg' ? `${uniqueSuffix}${ext}` : `${uniqueSuffix}`;

            cb(null, filename);
        }
    });

    return multer({ storage });
}



export function balanceTeams(teams) {
    const totalPlayers = teams.red.players.length + teams.blue.players.length;
    const half = Math.floor(totalPlayers / 2);
  
    while (Math.abs(teams.red.players.length - teams.blue.players.length) > 1) {
      if (teams.red.players.length > half) {
        // Move a player from red to blue
        const player = teams.red.players.pop();
        teams.blue.players.push(player);
      } else if (teams.blue.players.length > half) {
        // Move a player from blue to red
        const player = teams.blue.players.pop();
        teams.red.players.push(player);
      }
    }
  
    return teams;
  }
  
