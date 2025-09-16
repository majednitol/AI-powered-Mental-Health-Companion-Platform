// src/auth/session.middleware.ts
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

const PgSession = connectPgSimple(session);

export const SessionMiddleware = session({
  store: new PgSession({
    conString: process.env.DATABASE_URL!,
    createTableIfMissing: true,
    tableName: 'sessions',
    ttl: 7 * 24 * 60 * 60, // 1 week in seconds
  }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // set true if using HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week in ms
  },
}); 
