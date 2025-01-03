import { model, Schema } from 'mongoose';

const RocketSchema = new Schema({
  name: { type: String, required: true },
  speed: { type: Number, required: true },
  durability: { type: Number, required: true },
  fireRate: { type: Number, required: true },
  speciality: { type: String, required: true },
  range: { type: Number, required: true },
  rocketImage: { type: String, required: true },
  // weaponSlots: { type: Number, default: 2 },
}, { timestamps: true });

const Rocket = model('Rocket', RocketSchema);
export default Rocket;
