import { model, Schema } from 'mongoose';

const MatchSchema = new Schema({
  players: [{ type: Schema.Types.ObjectId, ref: "User" }],
  teams: [
    {
      name: { type: String, enum: ["red", "blue", "neutral"], required: true },
      players: [{ type: Schema.Types.ObjectId, ref: "User" }],
      score: { type: Number, default: 0 },
    },
  ],
  winner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    validate: {
      validator: function () {
        return this.gameMode === "free-for-all" ? !!this.winner : true;
      },
      message: "Winner is required for free-for-all mode.",
    },
  },
  winningTeam: {
    type: String,
    enum: ["red", "blue"],
    validate: {
      validator: function () {
        return this.gameMode !== "free-for-all" ? !!this.winningTeam : true;
      },
      message: "Winning team is required for team-based modes.",
    },
  },
  gameMode: {
    type: String,
    enum: ["team-deathmatch", "free-for-all", "capture-the-flag", "domination"],
    required: true,
  },
  map: { type: Schema.Types.ObjectId, ref: "Map" },
  objectives: [
    {
      type: { type: String, enum: ["flag", "control-point", "objective"] },
      team: { type: String, enum: ["red", "blue", "neutral"] },
      captured: { type: Boolean, default: false },
    },
  ],
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  stats: [
    {
      player: { type: Schema.Types.ObjectId, ref: "User" },
      kills: { type: Number, default: 0 },
      deaths: { type: Number, default: 0 },
      // score: { type: Number, default: 0 },
      team: { type: String, enum: ["red", "blue", "neutral"] },
    },
  ],
}, { timestamps: true });

const Match = model('Match', MatchSchema);
export default Match;
