import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { UserModel } from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();
passport.use(
  "google",
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        console.log("Google profile:", profile);
        const result = await UserModel.findByEmail(profile.emails[0].value);
        if (result.rows.length === 0) {
          const newUser = await UserModel.create({
            user_name: profile.displayName,
            email: profile.emails[0].value,
            password_hash: "google",
            role: "student",
            avatar_url: profile.photos[0]?.value || null,
            is_verified: true,
          });
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
        }
      } catch (err) {
        return cb(err);
      }
    },
  )
);

passport.serializeUser((user, cb) => {
    cb(null, user.user_id);
});

passport.deserializeUser(async (id, cb) => {
    try {
    const user = await UserModel.findById(id);
    cb(null, user);
  } catch (error) {
    cb(error, null);
  }
});

export default passport;