import { model, Schema } from 'mongoose';
import Rocket from './rocket.js';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  selectedRocket: {
    type: Schema.Types.ObjectId,
    ref: "Rocket",
  },
  rockets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Rocket",
    }
  ],
  weapons: [{ type: Schema.Types.ObjectId, ref: "Weapon" }],
  coin: { type: String, default: 0 },
  avatar: { type: String, default: "assets/imgs/uploads/default-avatar.svg" },
  stats: {
    totalKills: { type: Number, default: 0 },
    totalDeaths: { type: Number, default: 0 },
    matchesPlayed: { type: Number, default: 0 },
    matchesWon: { type: Number, default: 0 },
    // highestScore: { type: Number, default: 0 },
    rank: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum', 'emerald', 'diamond'], default: 'bronze' }
  },
  active: { type: Boolean, default: false },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.selectedRocket) {
    const rocket = await Rocket.findOne({ name: 'Rocket' });
    this.selectedRocket = rocket ? rocket._id : null;
  }
  if (!this.rockets || this.rockets.length === 0) {
    const rocket = await Rocket.findOne({ name: 'Rocket' });
    if (rocket) {
      this.rockets.push(rocket._id);
    }
  }
  next();
});

const User = model('User', UserSchema);
export default User;
