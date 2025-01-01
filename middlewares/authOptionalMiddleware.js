import User from '../models/user.js';
import { verifyToken } from './tokenManager.js';

export function authOptionalMiddleware(regexArray) {
    return async (req, res, next) => {
        try {
            const matches = regexArray.some((regex) => regex.test(req.path));

            if (matches) {
                return next();
            }


            await verifyToken(req, res, async () => {
                try {
                    const user = await User.findById(res.jwt.id);

                    if (!user) {
                        if (!req.path.startsWith('/api')) {
                            return res.redirect('/auth/login');
                        }
                        return res.status(401).json({
                            status: "ERROR",
                            response: "User not registered OR Token malfunctioned",
                        });
                    }

                    if (!user.active) {
                        if (!req.path.startsWith('/api')) {
                            return res.redirect('/auth/login');
                        }
                        return res.status(403).json({
                            status: "ERROR",
                            response: "Account is not active",
                        });
                    }

                    req.user = user;

                    return next();
                } catch (error) {
                    if (!req.path.startsWith('/api')) {
                        return res.redirect('/auth/login');
                    }
                    console.error("User validation error:", error);
                    return res.status(500).json({
                        status: "ERROR",
                        response: "Internal server error",
                    });
                }
            });
        } catch (error) {
            if (!req.path.startsWith('/api')) {
                return res.redirect('/auth/login');
            }
            console.error("General authentication error:", error);
            return res.status(500).json({
                status: "ERROR",
                response: "Internal server error",
            });
        }
    };
}
