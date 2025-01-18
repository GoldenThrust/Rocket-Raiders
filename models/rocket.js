import { model, Schema } from 'mongoose';

const RocketSchema = new Schema({
  name: { type: String, unique: true, required: true },
  speed: { type: Number, default: 5 },
  durability: { type: Number, default: 1 },
  fireRate: { type: Number, default: 500 },
  speciality: { type: String, default: 'Sonic Dash' },
  range: { type: Number, default: 5000 },
  rocket: { type: String, default: "assets/imgs/rockets/player.svg" },
  flame: { type: String, default: "assets/imgs/rockets/flame.svg" },
  price: { type: Number, default: 20},
  // weaponSlots: { type: Number, default: 2 },
}, { timestamps: true });

const Rocket = model('Rocket', RocketSchema);
export default Rocket;
