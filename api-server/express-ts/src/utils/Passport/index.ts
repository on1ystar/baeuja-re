// dotenv.config();

// passport.serializeUser((user, done) => {
//   done(null, user);
// });
// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// passport.use(
//   new Strategy(
//     {
//       clientID: conf.googleApi.clientId as string,
//       clientSecret: conf.googleApi.secret as string,
//       callbackURL:
//         process.env.RUN === 'dev'
//           ? `${conf.url.local}${CALLBACK_URL}`
//           : `${conf.url.domain}${CALLBACK_URL}`,
//       passReqToCallback: true
//     },
//     (request, accessToken, refreshToken, profile, done) => {
//       console.log('profile: ', profile);
//       const user = profile;

//       done(null, user);
//     }
//   )
// );

// export default passport;
