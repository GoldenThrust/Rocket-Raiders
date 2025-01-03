import { model, Schema } from 'mongoose';

const AdminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  active: { type: Boolean, default: false }
}, { timestamps: true });

const Admin = model('Admin', AdminSchema);
export default Admin;
