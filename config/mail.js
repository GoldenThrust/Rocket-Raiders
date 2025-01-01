import { createTransport } from "nodemailer";
import { DEV, hostUrl } from "../utils/constants.js";
import process from "process";

class MailService {
    constructor() {
        this.hostUrl = hostUrl;
        const configOptions = DEV ? {
            host: '0.0.0.0',
            port: 1025,
            secure: false,
            tls: {
                rejectUnauthorized: false,
            },

        } : {
            service: "Gmail",
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        }

        this.transporter = createTransport(configOptions);
    }
    async sendActivationLink(user, crypto) {
        const verificationLink = `${this.hostUrl}/auth/activate/${crypto}`;
        const imgLink = `${this.hostUrl}/logo.svg`;

        const mailTemplate = `
                        <body>
                            <div
                                style="font-family: Arial, sans-serif; background-color: #212020; padding: 20px; text-align:center; color:antiquewhite; width: 50%; margin: auto; border-radius: 10%;">
                                <h1 style="text-align: center; color: #333;">
                                    <img src=${imgLink} alt="Rocket Raider">
                                </h1>
                                <p style="font-size: 16px;">
                                    <div style="font-size: larger; font-weight:bolder;">
                                        Hello ${user.name || 'User'},<br><br>
                                    </div>
                                    Thank you for signing up on Rocket Raider! Please confirm your email address to complete your registration.
                                </p>
                                <p style="text-align: center;">
                                    <a href="${verificationLink}"
                                        style="background-color: #814caf; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                                        Verify Your Email
                                    </a>
                                </p>
                                <p style="font-size: 14px; color: #999; text-align: center;">
                                    This link will expire in 24 hours. If you didn’t request this, please ignore this email.
                                </p>
                            </div>
                        </body>;`;

        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: user.email,
            subject: "Email Verification",
            text: `Please verify your email by clicking the following link: ${verificationLink}`,
            html: mailTemplate
        };

        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, async (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    }

    async sendResetPasswordEmail(user, crypto) {
        const resetPasswordLink = `${this.hostUrl}/auth/reset-password/${crypto}/`;
        const imgLink = `${this.hostUrl}/logo.svg`;

        const mailTemplate = `
                            <body>
                                <div
                                    style="font-family: Arial, sans-serif; background-color: #212020; padding: 20px; text-align:center; color:antiquewhite; width: 50%; margin: auto; border-radius: 10%;">
                                    <h1 style="text-align: center; color: #333;">
                                        <img src=${imgLink} alt="Rocket Raider">
                                    </h1>
                                    <p style="font-size: 16px;">
                                        <div style="font-size: larger; font-weight:bolder;">
                                            Hello ${user.name || 'User'},<br><br>
                                        </div>
                                        We received a request to reset your password. Click the button below to reset your password.
                                    </p>
                                    <p style="text-align: center;">
                                        <a href="${resetPasswordLink}"
                                            style="background-color: #814caf; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                                            Reset Password
                                        </a>
                                    </p>
                                    <p style="font-size: 14px; color: #999; text-align: center;">
                                        This link will expire in 24 hours. If you didn’t request this, please ignore this email.
                                    </p>
                                </div>
                            </body>`;

        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: user.email,
            subject: "Sync: Reset Password",
            text: `Please reset your password by clicking the following link: ${resetPasswordLink}`,
            html: mailTemplate
        };

        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, async (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    }
}

const mail = new MailService();
export default mail;
