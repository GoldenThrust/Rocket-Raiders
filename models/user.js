import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rockets: [{ type: Schema.Types.ObjectId, ref: "Rocket" }],
  weapons: [{ type: Schema.Types.ObjectId, ref: "Weapon" }],
  coin: { type: String, default: 0 },
  avatar: { type: String, default: "assets/imgs/uploads/default-avatar.svg" },
  stats: {
    totalKills: { type: Number, default: 0 },
    totalDeaths: { type: Number, default: 0 },
    matchesPlayed: { type: Number, default: 0 },
    matchesWon: { type: Number, default: 0 },
    highestScore: { type: Number, default: 0 },
    rank: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum', 'emerald', 'diamond'], default: 'bronze' }
  },
  active: { type: Boolean, default: false },
}, { timestamps: true });

const User = model('User', UserSchema);
export default User;
