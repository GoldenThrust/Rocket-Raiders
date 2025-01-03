import { model, Schema } from 'mongoose';

const LeaderboardSchema = new Schema({
  season: { type: String, required: true },
  players: [
    {
      player: { type: Schema.Types.ObjectId, ref: "User" },
      score: { type: Number, required: true },
    },
  ],
}, { timestamps: true });

const Leaderboard = model('Leaderboard', LeaderboardSchema);
export default Leaderboard;
