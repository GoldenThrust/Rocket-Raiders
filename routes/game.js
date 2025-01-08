import { Router } from "express";
import gameController from '../controllers/gameController.js'

const gameRoutes = Router();

gameRoutes.get('/get-match/:matchId', gameController.getMatch);
gameRoutes.get('/get-matches', gameController.getMatches);
gameRoutes.get('/maps', gameController.getMaps);
gameRoutes.get('/start-game/:gameId', gameController.startGame);


gameRoutes.get('/:gameMode', gameController.initiateGame);
export default gameRoutes;