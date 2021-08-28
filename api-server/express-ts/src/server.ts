import app from './app';

const port: number = Number(process.env.PORT) || 4000;

app.listen(port, (): void =>
  // eslint-disable-next-line no-console
  console.log(`✅ Server listening on api.k-peach.io`)
);
