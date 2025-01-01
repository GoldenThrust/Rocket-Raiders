import User from "../models/user.js";
import { hash, verify } from "argon2";
import { createToken } from "../middlewares/tokenManager.js";
import { COOKIE_NAME, hostUrl } from "../utils/constants.js";
import mail from "../config/mail.js";
import { redis } from "../config/db.js";
import { v7 as uuid } from 'uuid';

const domain = (new URL(hostUrl)).hostname

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
            });

            if (!user) {
                return res.status(401).json({ status: "ERROR", message: "Invalid credentials" });
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
                .json({ status: "OK", message: response });
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
                await mail.sendResetPasswordEmail(user);
            } catch (error) {
                res.status(500).json({ status: "ERROR", message: "Failed to send password link" });
            }

            res.json({ status: "OK", message: "Please check your email for your password reset link" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: "ERROR", message: 'Internal Server Error' });
        }

    }

    async resetPassword(req, res) {

        try {
            const { password } = req.body;
            const token = req.params.token;
            const email = await redis.get(token);
            console.log(token, email);
            if (!email) {
                return res.status(401).json({ status: "ERROR", message: "Invalid or expired token" });
            }

            const hashedPassword = await hash(password);
            await User.findOneAndUpdate(
                { email },
                { $set: { password: hashedPassword } },
                { new: true }
            );

            await redis.del(token);
            res.status(201).json({ status: "OK", message: "Password reset successfully" })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: "ERROR", message: 'Internal Server Error' });
        }
    }
}

const authController = new AuthenticationController();

export default authController;