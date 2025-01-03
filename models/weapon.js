import { model, Schema } from 'mongoose';

const WeaponSchema = new Schema({
  name: { type: String, required: true },
  damage: { type: Number, required: true },
  fireRate: { type: Number, required: true },
  range: { type: Number, required: true },
  type: { type: String, enum: ["laser", "missile", "plasma", "gun"], required: true },
}, { timestamps: true });

const Weapon = model('Weapon', WeaponSchema);
export default Weapon;
