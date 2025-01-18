import User from "../models/user.js";
import { hash, verify } from "argon2";
import { createToken } from "../middlewares/tokenManager.js";
import { COOKIE_NAME, hostUrl } from "../utils/constants.js";
import mail from "../config/mail.js";
import { redis } from "../config/db.js";
import { v4 as uuid } from 'uuid';
import Admin from "../models/admin.js";
import jwt from "jsonwebtoken";
import fs from 'fs';
import Map from "../models/map.js";
import Rocket from "../models/rocket.js";

const domain = (new URL(hostUrl)).hostname
const rocketUrl = "assets/imgs/rockets";
const mapUrl = "assets/imgs/maps";
const rockets = [
    {
        name: 'Swift',
        speed: 10,
        durability: 1,
        fireRate: 250,
        range: 6000,
        speciality: 'Sonic Dash',
        price: 15,
        rocket: `${rocketUrl}/swift.svg`,
        flame: `${rocketUrl}/swift-flame.svg`,
    },
    {
        name: 'Absorb',
        speed: 8,
        durability: 1,
        fireRate: 300,
        range: 5000,
        speciality: 'Black Hole',
        price: 20,
        rocket: `${rocketUrl}/absorb.svg`,
        flame: `${rocketUrl}/playerburst.svg`,
    },
    {
        name: 'Dive',
        speed: 9,
        durability: 1,
        fireRate: 280,
        range: 5500,
        speciality: 'Sonic Dash',
        price: 18,
        rocket: `${rocketUrl}/dive.svg`,
        flame: `${rocketUrl}/playerburst.svg`,
    },
    {
        name: 'Storm',
        speed: 12,
        durability: 1,
        fireRate: 220,
        range: 7000,
        speciality: 'Track Gun',
        price: 25,
        rocket: `${rocketUrl}/storm.svg`,
        flame: `${rocketUrl}/playerburst.svg`,
    },
    {
        name: 'Rocket',
        speed: 5,
        durability: 1,
        fireRate: 300,
        range: 5000,
        speciality: 'Sonic Dash',
        price: 10,
        rocket: `${rocketUrl}/player.svg`,
        flame: `${rocketUrl}/playerburst.svg`,
    },
];


const maps = [
    {
        name: 'Abyss',
        description: 'A dark and foreboding chasm filled with unknown terrors and secrets.',
        background: `${mapUrl}/abyss.jpg`
    },
    {
        name: 'Lure',
        description: 'A deceptive landscape that entices with beauty but hides many traps.',
        background: `${mapUrl}/lure.jpg`
    },
    {
        name: 'Scare',
        description: 'A haunting terrain with eerie sounds and ghostly apparitions at every turn.',
        background: `${mapUrl}/scare.jpg`
    },
    {
        name: 'Mystic',
        description: 'A mysterious map filled with ancient ruins and mystical energies.',
        background: `${mapUrl}/mystic.jpg`
    },
    {
        name: 'Earth',
        description: 'A fertile land rich in natural beauty and abundant wildlife, but not without its dangers.',
        background: `${mapUrl}/earth.jpg`
    }
];

class AuthenticationController {
    async verify(req, res) {
        try {
            const user = req.user;
            const { password, active, ...response } = user.toJSON();

            return res
                .status(200)
                .json({ status: "OK", response });
        } catch (error) {
            console.error(error);
            return res.status(401).json({ status: "ERROR", data: "Internal Server Error" });
        }
    }

    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            const existingUser = await User.findOne({
                $or: [{ email }, { username }]
            });

            if (existingUser && existingUser.active) {
                if (existingUser.email === email) {
                    return res.status(403).json({ status: "ERROR", message: "Email is already registered" });
                }
                if (existingUser.username === username) {
                    return res.status(403).json({ status: "ERROR", message: "Username is not available" });
                }
            }

            const hashedPassword = await hash(password);


            const rocket = await Rocket.findOne({ name: 'Rocket' });
            const map = await Map.findOne({ name: 'Mystic' })


            if (!rocket) {
                await Rocket.insertMany(rockets, { ordered: false })
                    .then(docs => {
                        console.log('Rocket inserted:', docs);
                    })
                    .catch(err => {
                        console.error('InsertMany error:', err);
                    });;
            }

            if (!map) {
                await Map.insertMany(maps, { ordered: false })
                    .then(docs => {
                        console.log('Map inserted:', docs);
                    })
                    .catch(err => {
                        console.error('InsertMany error:', err);
                    });;
            }


            let user;

            if (existingUser) {
                existingUser.username = username;
                existingUser.email = email;
                existingUser.password = hashedPassword;
                await existingUser.save();
                user = existingUser;
            } else {
                user = new User({ username, email, password: hashedPassword });
                await user.save();
            }

            const activationToken = uuid();
            await redis.set(`activations_${activationToken}`, user.email, 24 * 60 * 60);

            // Send email to activate the user account
            try {
                await mail.sendActivationLink(user, activationToken);
            } catch (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ status: "ERROR", message: "Failed to send activation link" });
            }

            return res
                .status(201)
                .json({ status: "OK", message: "Please check your email to activate your account." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: "ERROR", message: 'Internal Server Error' });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({
                $or: [{ username }, { email: username }],
            }).populate(['selectedRocket']);

            if (!user) {
                return res.status(401).json({ status: "ERROR", message: "Invalid Username or Email" });
            }

            if (!user.active) {
                return res.status(403).json({ status: "ERROR", message: "Account is not active" })
            }

            const isPasswordCorrect = await verify(user.password, password);
            if (!isPasswordCorrect) {
                return res.status(401).json({ status: "ERROR", message: "Password is incorrect" })
            }

            res.clearCookie(COOKIE_NAME, {
                secure: true,
                sameSite: "none",
                httpOnly: true,
                domain,
                signed: true,
                path: "/",
            });

            const token = createToken(user, "7d");
            const expires = new Date();
            expires.setDate(expires.getDate() + 7);

            res.cookie(COOKIE_NAME, token, {
                secure: true,
                sameSite: "none",
                httpOnly: true,
                path: "/",
                domain,
                expires,
                signed: true,
            });

            const { password: pass, active, ...response } = user.toJSON();

            return res
                .status(200)
                .json({ status: "OK", response });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: "ERROR", message: 'Internal Server Error' });
        }
    }


    async logout(req, res) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).send({ "message": "User not registered OR Token malfunctioned" });
            }

            res.clearCookie(COOKIE_NAME, {
                secure: true,
                sameSite: "none",
                httpOnly: true,
                domain,
                signed: true,
                path: "/",
            });


            return res
                .status(200)
                .json({ status: "OK" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: "ERROR", message: 'Internal Server Error' });
        }
    }

    async updateProfile(req, res) {
        try {
            const user = req.user;
            if (!req.file && !req.file.path) {
                return res.status(400).json({ status: "ERROR", message: "No data provided" });
            }

            let avatar = req.file.path;

            if (avatar) {
                if (fs.existsSync(user.avatar) && user.avatar !== 'assets/imgs/default-avatar.svg')
                    fs.unlinkSync(user.avatar);
                user.avatar = avatar;
            }

            await user.save();

            return res.status(200).json({ status: "OK", message: "Profile updated successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: "ERROR", message: 'Internal Server Error' });
        }
    }

    async activateAccount(req, res) {
        try {
            const authtoken = req.params.crypto;

            const email = await redis.get(`activations_${authtoken}`);

            if (!email) {
                return res.status(401).json({ status: "ERROR", message: "Invalid or expired token" });
            }

            const user = await User.findOneAndUpdate(
                { email },
                { $set: { active: true } },
                { new: true }
            );

            if (!user) {
                return res.status(500).json({ status: "ERROR", message: "User not found" });
            }


            res.clearCookie(COOKIE_NAME, {
                secure: true,
                sameSite: "none",
                httpOnly: true,
                domain,
                signed: true,
                path: "/",
            });

            const token = createToken(user, "7d");
            const expires = new Date();
            expires.setDate(expires.getDate() + 7);

            res.cookie(COOKIE_NAME, token, {
                secure: true,
                sameSite: "none",
                httpOnly: true,
                path: "/",
                domain,
                expires,
                signed: true,
            });

            await redis.del(`activations_${authtoken}`);
            const { password, active, ...response } = user.toJSON();

            return res
                .status(200)
                .json({ status: "OK", message: response });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: "ERROR", message: 'Internal Server Error' });
        }
    }

    async forgotPassword(req, res) {
        try {
            const { username } = req.body;

            if (!username) {
                return res.status(400).json({ status: "ERROR", message: "Username or email is required" });
            }

            const user = await User.findOne({
                $or: [{ username }, { email: username }],
            });

            if (!user) {
                return res.status(401).json({ status: "ERROR", message: "Invalid credentials" });
            }

            if (!user.active) {
                return res.status(403).json({ status: "ERROR", message: "Account is not active" })
            }

            try {
                const activationToken = uuid();
                await redis.set(`reset_password_${activationToken}`, user.email, 24 * 60 * 60);

                await mail.sendResetPasswordEmail(user, activationToken);
            } catch (error) {
                return res.status(500).json({ status: "ERROR", message: "Failed to send password link" });
            }

            return res.json({ status: "OK", message: "Please check your email for your password reset link" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: "ERROR", message: 'Internal Server Error' });
        }

    }

    async resetPassword(req, res) {
        try {
            const { password } = req.body;
            const activationToken = req.params.crypto;
            const email = await redis.get(`reset_password_${activationToken}`);
            if (!email) {
                return res.status(401).json({ status: "ERROR", message: "Invalid or expired token" });
            }

            const hashedPassword = await hash(password);
            await User.findOneAndUpdate(
                { email },
                { $set: { password: hashedPassword } },
                { new: true }
            );

            await redis.del(`reset_password_${activationToken}`);
            res.status(201).json({ status: "OK", message: "Your password has been updated successfully" })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: "ERROR", message: 'Internal Server Error' });
        }
    }

    async adminActivateAccount(req, res) {
        try {
            const authtoken = req.params.crypto;

            const email = await redis.get(`admin_${authtoken}`);

            if (!email) {
                return res.status(401).json({ status: "ERROR", message: "Invalid or expired token" });
            }

            const admin = await Admin.findOneAndUpdate(
                { email },
                { $set: { active: true } },
                { new: true }
            );

            if (!admin) {
                return res.status(500).json({ status: "ERROR", message: "Admin not found" });
            }

            await redis.del(`admin_${authtoken}`)

            return res
                .status(200)
                .json({ status: "OK", message: admin.toJSON() });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: "ERROR", message: 'Internal Server Error' });
        }
    }

    async adminLoginLink(req, res) {
        try {
            const { email: bodyEmail, crypto } = req.body;

            if (!crypto) {
                if (!bodyEmail) {
                    return res.status(401).json({ status: "ERROR", message: "Invalid credentials" });
                }

                const admin = await Admin.findOne({ email: bodyEmail });

                if (!admin) {
                    return res.status(401).json({ status: "ERROR", message: "Invalid credentials" });
                }

                const generatedCrypto = uuid();
                await redis.set(`admin_login_${generatedCrypto}`, bodyEmail, 60 * 60);

                await mail.sendAdminSessionLink(bodyEmail, generatedCrypto);

                return res.status(200).json({ status: "OK", message: "Login link sent to email." });
            } else {
                const storedEmail = await redis.get(`admin_login_${crypto}`);

                if (!storedEmail) {
                    return res.status(401).json({ status: "ERROR", message: "Invalid or expired token" });
                }

                const admin = await Admin.findOne({ email: storedEmail });

                if (!admin) {
                    return res.status(401).json({ status: "ERROR", message: "Invalid credentials" });
                }

                if (!admin.active) {
                    return res.status(403).json({ status: "ERROR", message: "Account is not active" });
                }

                res.clearCookie(`${COOKIE_NAME}_admin`, {
                    secure: true,
                    sameSite: "none",
                    httpOnly: true,
                    domain,
                    signed: true,
                    path: "/",
                });

                const jwtSecret = process.env.JWT_SECRET;
                const token = jwt.sign({ id: admin._id, email: admin.email }, jwtSecret, { expiresIn: "7d" });

                const expires = new Date();
                expires.setDate(expires.getDate() + 7);

                res.cookie(`${COOKIE_NAME}_admin`, token, {
                    secure: true,
                    sameSite: "none",
                    httpOnly: true,
                    path: "/",
                    domain,
                    expires,
                    signed: true,
                });

                return res.status(200).json({ status: "OK", message: "Login successful" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: "ERROR", message: 'Internal Server Error' });
        }
    }

    async adminVerify(req, res) {
        try {
            return res.status(200).json({
                status: "OK",
                message: req.admin,
            });
        } catch (error) {
            console.error(error);

            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ status: "ERROR", message: "Token has expired" });
            }

            if (error.name === "JsonWebTokenError") {
                return res.status(401).json({ status: "ERROR", message: "Invalid token" });
            }

            return res.status(500).json({ status: "ERROR", message: "Internal Server Error" });
        }
    }

    async createMap(req, res) {
        const { name, description } = req.body;
        try {
            let background = req?.file?.path;

            if (!name || !description || !background) {
                return res.status(401).json({ status: "ERROR", message: "Invalid Credentials" });
            }

            const map = new Map({ name, description, background });
            await map.save();

            res.status(201).json({ status: "OK", message: "Map created successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ status: "ERROR", message: "Internal Server Error" });
        }
    }

    async createRocket(req, res) {
        const { name, speed, durability, speciality, fireRate, range, price } = req.body;
        const rocket = req.files['rocket'] ? req.files['rocket'][0].path : null;
        const flame = req.files['flame'] ? req.files['flame'][0].path : null;
        try {
            if (!name || !speed || !durability || !speciality || !fireRate || !range || !rocket || !price) {
                return res.status(401).json({ status: "ERROR", message: "Invalid Credentials" });
            }
            const data = { name, speed, durability, speciality, fireRate, range, rocket, price };

            if (flame) {
                data['flame'] = flame;
            }

            const rockets = new Rocket({ ...data });
            await rockets.save();

            res.status(201).json({ status: "OK", message: "Rocket created successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ status: "ERROR", message: "Internal Server Error" });
        }
    }
}

const authController = new AuthenticationController();

export default authController;