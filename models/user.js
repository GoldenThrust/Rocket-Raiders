import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: String,
    active: {
        type: Boolean,
        default: false
    },
    total_game_play: {
        type: Number,
        default: 0
    },
    total_game_win: {
        type: Number,
        default: 0
    },
    total_kills: {
        type: Number,
        default: 0
    },
    ranks: {
        type: String,
        default: 'silver',
    }
}, { timestamps: true })

const User = model('User', UserSchema);
export default User;
