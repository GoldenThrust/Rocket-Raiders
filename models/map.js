import { model, Schema } from 'mongoose';

const MapSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "A mysterious space battlefield" },
  //   dimensions: {
  //     width: { type: Number, required: true },
  //     height: { type: Number, required: true },
  //   },
  //   obstacles: [
  //     {
  //       type: { type: String, enum: ["asteroid", "debris", "blackhole"], required: true },
  //       location: {
  //         x: { type: Number, required: true },
  //         y: { type: Number, required: true },
  //       },
  //       size: { type: Number, default: 50 },
  //     },
  //   ],
  //   spawnPoints: [
  //     {
  //       team: { type: String, enum: ["blue", "red", "neutral"], default: "neutral" },
  //       location: {
  //         x: { type: Number, required: true },
  //         y: { type: Number, required: true },
  //       },
  //     },
  //   ],
  //   powerUps: [
  //     {
  //       powerUp: { type: Schema.Types.ObjectId, ref: "PowerUp" },
  //       location: {
  //         x: { type: Number, required: true },
  //         y: { type: Number, required: true },
  //       },
  //       respawnTime: { type: Number, default: 30 },
  //     },
  //   ],
  // environment: {
  //   background: { type: String, default: "default-space.jpg" },
  //   hazards: [
  //     {
  //       type: { type: String, enum: ["radiation", "gravity", "wormhole"] },
  //       intensity: { type: Number, default: 1 },
  //     },
  //   ],
  // },
  background: { type: String, default: "assets/imgs/enlight.jpg" },
}, { timestamps: true });

const Map = model('Map', MapSchema);
export default Map;
