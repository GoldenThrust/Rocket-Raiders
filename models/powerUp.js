import { model, Schema } from 'mongoose';

const PowerUpSchema = new Schema({
  name: { type: String, required: true },
  effect: { type: String, required: true },
  duration: { type: Number, required: true },
  location: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
}, { timestamps: true });

const PowerUp = model('PowerUp', PowerUpSchema);
export default PowerUp;
