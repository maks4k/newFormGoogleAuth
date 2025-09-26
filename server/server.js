import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

// console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
// console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET);
// console.log('Env loaded:', !!process.env.GOOGLE_CLIENT_ID);

const app = express();
const prisma = new PrismaClient();

import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import nodemailer from "nodemailer";

app.use(express.json()); //для ответов сервера
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true })); //указываем на каком порте будет принимать запросы ,надо что бы он мечился с клинетским сервером
app.use(passport.initialize());
const jwtSecret = process.env.JWT_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

const tokens_expiration_time = {
  jwt_acces_token_format: "1h",
  jwt_refresh_token: "7d",
  jwt_reset_token_format: "10m",
  date_acces_token_format: 60 * 60 * 1000,
  date_refresh_token_format: 7 * 24 * 60 * 60 * 1000,
};
export const BaseFormSchemaConst = {
  emailMin: 6,
  passwordMin: 4,
  passwordMax: 20,
};

const PasswordSchema = z
  .string()
  .min(
    BaseFormSchemaConst.passwordMin,
    `Password must not be less than ${BaseFormSchemaConst.passwordMin} characters.`,
  )
  .max(
    BaseFormSchemaConst.passwordMax,
    `Password must not be more than ${BaseFormSchemaConst.passwordMax} characters.`,
  )
  .regex(/[A-Z]/, "Password must contain capital characters.")
  .regex(/[a-z]/, "Password must contain small characters.")
  .regex(/[0-9]/, "Password must contain numeric characters.");

const EmailSchema = z
  .string()
  .email()
  .min(
    BaseFormSchemaConst.emailMin,
    `Email must be at least ${BaseFormSchemaConst.emailMin} characters.`,
  );

const EmailFormSchema = z.object({ email: EmailSchema });
const PasswordFormSchema = z.object({ password: PasswordSchema });
const BaseFormSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export const signinFormSchema = BaseFormSchema;

export const signUpFormSchema = BaseFormSchema.extend({
  confirmPassword: PasswordSchema.optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const generateTokens = (id, email) => {
  const accessToken = jwt.sign({ id, email }, jwtSecret, {
    expiresIn: tokens_expiration_time.jwt_acces_token_format,
  });
  const refreshToken = jwt.sign({ id, email }, jwtRefreshSecret, {
    expiresIn: tokens_expiration_time.jwt_refresh_token,
  });
  return { token: accessToken, refreshToken };
};

app.post("/api/signin", async (req, resp) => {
  const result = signinFormSchema.safeParse(req.body);

  if (!result.success) {
    return resp.status(400).json({ error: result.error.flatten().fieldErrors });
  }
  const { email, password } = result.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return resp.status(401).json({ error: "Email is not correct" });
    }
    const isValiadPassword = await bcrypt.compare(password, user.password);
    if (!isValiadPassword) {
      return resp.status(401).json({ error: "password is not correct" });
    }
    const { token, refreshToken } = generateTokens(user.id, user.email);
    await prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        refreshToken: refreshToken,
        expiresAt: new Date(
          Date.now() + tokens_expiration_time.date_refresh_token_format,
        ),
      },
    });
    return resp
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: true,
        maxAge: tokens_expiration_time.date_acces_token_format,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: true,
        maxAge: tokens_expiration_time.date_refresh_token_format,
      })
      .status(200)
      .json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    return resp.status(500).json({ error: "Server error" });
  }
});

app.post("/api/signup", async (req, resp) => {
  const result = signUpFormSchema.safeParse(req.body);

  if (!result.success) {
    return resp.status(400).json({ error: result.error.flatten().fieldErrors });
  }
  const { email, password } = result.data;
  try {
    const isUserExist = await prisma.user.findUnique({ where: { email } });
    if (isUserExist) {
      return resp.status(400).json({ error: "Email is already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    if (newUser) {
      const { token, refreshToken } = generateTokens(newUser.id, newUser.email);

      await prisma.refreshToken.create({
        data: {
          userId: newUser.id,
          refreshToken: refreshToken,
          expiresAt: new Date(
            Date.now() + tokens_expiration_time.date_refresh_token_format,
          ),
        },
      });
      return resp
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: true,
          maxAge: tokens_expiration_time.date_acces_token_format,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: true,
          maxAge: tokens_expiration_time.date_refresh_token_format,
        })
        .status(200)
        .json({ user: { id: newUser.id, email: newUser.email } });
    } else {
      throw new Error();
    }
  } catch (error) {
    return resp.status(500).json({ error: "Server error" });
  }
});

app.post("/api/signout", async (req, resp) => {
  try {
    const userId = req.body.id;
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
    return resp
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json({ message: "Signout succes" });
  } catch (error) {
    return resp.status(500).json({ error: "Server error" });
  }
});

const checkAuth = (req, resp, next) => {
  const messages = {
    notFoundToken: "Token is not found",
    invalidToken: "invalid token",
  };
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error(messages.notFoundToken);
    }
    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        return resp.status(401).json({ error: messages.invalidToken });
      } else {
        req.user = user;
        next();
      }
    });
  } catch (error) {
    // console.log(error);

    return resp.status(401).json({ error: error.message });
  }
};

app.get("/api/protected", checkAuth, async (req, resp) => {
  console.log("Protected user:", req.user);
  return resp
    .status(200)
    .json({ user: { id: req.user.id, email: req.user.email } });
});

app.get("/api/refresh-token", async (req, resp) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return resp.status(401).json({ error: "Refresh token is not found" });
  jwt.verify(refreshToken, jwtRefreshSecret, async (err, user) => {
    if (err) {
      return resp.status(401).json({ error: "invalid refresh token" });
    }

    try {
      const dbRefreshToken = await prisma.refreshToken.findUnique({
        where: { refreshToken },
      });

      if (
        !dbRefreshToken ||
        !dbRefreshToken.refreshToken ||
        dbRefreshToken.refreshToken !== refreshToken
      )
        throw new Error("invalid refrsh token");

      const { token, refreshToken: newRefreshToken } = generateTokens(
        user.id,
        user.email,
      );
      await prisma.refreshToken.update({
        where: { id: dbRefreshToken.id },
        data: {
          refreshToken: newRefreshToken,
          expiresAt: new Date(
            Date.now() + tokens_expiration_time.date_refresh_token_format,
          ),
        },
      });
      return resp
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: true,
          maxAge: tokens_expiration_time.date_acces_token_format,
        })
        .cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: true,
          maxAge: tokens_expiration_time.date_refresh_token_format,
        })
        .status(200)
        .json({ user: { id: user.id, email: user.email } });
    } catch (error) {
      return resp.status(401).json({ error: error.message });
    }
  });
});

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(async (id, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth-google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        if (!profile.id || !profile.emails[0]?.value)
          throw new Error("fail google auth");
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });
        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails[0].value,
            },
          });
        }
        const tokens = generateTokens(user.id, user.email);
        return done(null, { user, tokens });
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

app.get(
  "/api/auth-google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user, info) => {
      if (err) {
        console.log("Authentication error:", err);
        return res.redirect(
          `${process.env.FRONTEND_URL}/signin?google_auth_error=true`,
        );
      }
      if (!user) {
        console.log("Authentication failed:", info);
        return res.redirect(
          `${process.env.FRONTEND_URL}/signin?google_auth_error=true"}`,
        );
      }

      req.user = user;
      next();
    })(req, res, next);
  },
  async (req, resp) => {
    try {
      const { user, tokens } = req.user;

      await prisma.refreshToken.deleteMany({
        where: { userId: user.id },
      });

      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          refreshToken: tokens.refreshToken,
          expiresAt: new Date(
            Date.now() + tokens_expiration_time.date_refresh_token_format,
          ),
        },
      });

      return resp
        .cookie("token", tokens.token, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: tokens_expiration_time.date_acces_token_format,
        })
        .cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: tokens_expiration_time.date_refresh_token_format,
        })
        .redirect(process.env.FRONTEND_URL);
    } catch (error) {
      console.log("Callback processing error:", error);
      return resp.redirect(
        `${process.env.FRONTEND_URL}/signin?google_auth_error=true`,
      );
    }
  },
);

app.get(
  "/api/auth-google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);
const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  transporter.sendMail({
    from: `Support<${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};
app.post("/api/forgot-password", async (req, resp) => {
  const res = EmailFormSchema.safeParse(req.body);
  if (!res.success) {
    return resp.status(401).json({ errors: res.error.flatten().fieldErrors });
  }
  const { email } = res.data;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.googleId) {
      return resp.status(404).json({ error: "User not found" });
    }
    const resetToken = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
      expiresIn: tokens_expiration_time.jwt_reset_token_format,
    });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail(
      email,
      "Востановление пароля",
      `<p>Перейдите по ссылке чтобы сбросить пароль: <a href="${resetLink}">Сбросить пароль</a></p>`,
    );
    return resp.status(200).json({ message: "Password recovery link sent" });
  } catch (error) {
    console.log(error);

    return resp.status(500).json({ error: "Server error" });
  }
});
app.post("/api/reset-password", async (req, resp) => {
  const res = PasswordFormSchema.safeParse(req.body);
  if (!res.success) {
    return resp.status(401).json({ errors: res.error.flatten().fieldErrors });
  }
  const { password, token } = req.body;
  if (!token) {
    return resp.status(401).json({ error: "token is not found" });
  }
  jwt.verify(token, jwtSecret, async (err, parsed_user) => {
    if (err) {
      return resp.status(401).json({ error: "invalid token" });
    }
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: parsed_user.id,
          email: parsed_user.email,
        },
      });
      if (!user) {
        return resp.status(404).json({ error: "user is not found" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: {
          id: user.id,
          email: user.email,
        },
        data:{password:hashedPassword}
      });
      return resp.status(201).json({message:"password is refreshed suuccesfaly"})
    } catch (error) {
      return resp.status(500).json({error:"server error"})
    }
  });
});
app.listen(4000, () => {
  console.log("server open");
}); //указываем на каком порте будет работать сервер
