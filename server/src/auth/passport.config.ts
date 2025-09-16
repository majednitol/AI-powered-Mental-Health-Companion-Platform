import passport from 'passport';
import { Strategy as OpenIDConnectStrategy } from 'passport-openidconnect';
import { AuthService } from './auth.service';

export function configurePassport(authService: AuthService) {
  // Serialize user into session
  passport.serializeUser((user, done) => {
    console.log('--- serializeUser ---');
    console.log(user); // Log the user object being serialized
    done(null, user); // save whole user or just user.id
  });

  // Deserialize user from session
  passport.deserializeUser((user: any, done) => {
    console.log('--- deserializeUser ---');
    console.log(user); // Log the user object being deserialized
    done(null, user); // fetch from DB if you only saved user.id
  });

  // OpenID Connect strategy
  passport.use(
    new OpenIDConnectStrategy(
      {
        issuer: 'https://accounts.google.com',
        authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenURL: 'https://oauth2.googleapis.com/token',
        userInfoURL: 'https://openidconnect.googleapis.com/v1/userinfo',
        clientID: process.env.CLIENT_ID!,
        clientSecret: process.env.CLIENT_SECRET!,
        callbackURL: process.env.CALLBACK_URL!,
        scope: ['openid', 'email', 'profile'],
      },
      async (issuer, profile, done) => {
        try {
          console.log('--- Google profile received ---');
          console.log(profile); // Log the profile returned from Google
          
          const user = await authService.validateUser(profile);

          console.log('--- User after validation ---');
          console.log(user); // Log the user after saving/validation
          
          done(null, user);
        } catch (err) {
          console.error('Error validating user:', err);
          done(err, false);
        }
      },
    ),
  );
}
