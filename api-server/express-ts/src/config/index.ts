import dotenv from 'dotenv';

dotenv.config();

const conf: {
  peachApi: {
    accessKey: string | undefined;
    secretKey: string | undefined;
    region: string | undefined;
  };
  bucket: { data: string | undefined };
  db: {
    host: string | undefined;
    user: string | undefined;
    pw: string | undefined;
    name: string | undefined;
    port: string | undefined;
  };
  peachAi: { ip: string | undefined };
} = {
  peachApi: {
    accessKey: process.env.PEACH_API_ACCESS_KEY_ID,
    secretKey: process.env.PEACH_API_SECRET_ACCESS_KEY,
    region: process.env.PEACH_API_REGION
  },
  bucket: {
    data: process.env.BUCKET_DATA
  },
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    pw: process.env.DB_PW,
    name: process.env.DB_NAME,
    port: process.env.DB_PORT
  },
  //   jwt: {
  //     secretKey: Buffer.from(process.env.JWT_SECRET_KEY),
  //     options: {
  //       expiresIn: process.env.JWT_EXPIRES_IN,
  //       issuer: process.env.JWT_ISSUER
  //     }
  //   },
  peachAi: {
    ip: process.env.PEACH_AI_IP
  }
};

export default conf;
