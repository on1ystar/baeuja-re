import dotenv from 'dotenv';

dotenv.config();

const conf: {
  peachApi: {
    accessKey: string | undefined;
    secretKey: string | undefined;
    region: string | undefined;
  };
  s3: {
    region: string | undefined;
    bucketData: string | undefined;
    bucketDataCdn: string | undefined;
  };
  db: {
    host: string | undefined;
    user: string | undefined;
    pw: string | undefined;
    name: string | undefined;
    port: string | undefined;
  };
  googleApi: {
    clientId: string | undefined;
    secret: string | undefined;
  };
  peachAi: { ip: string | undefined };
  url: { local: string; domain: string };
  jwtToken: {
    secretKey: string | undefined;
    option: {
      expiresIn: string | undefined;
      issuer: string | undefined;
      subject: string | undefined;
    };
    optionGuest: {
      issuer: string | undefined;
      subject: string | undefined;
    };
    optionExpired: {
      expiresIn: string | undefined;
      issuer: string | undefined;
      subject: string | undefined;
    };
  };
} = {
  peachApi: {
    accessKey: process.env.PEACH_API_ACCESS_KEY_ID,
    secretKey: process.env.PEACH_API_SECRET_ACCESS_KEY,
    region: process.env.PEACH_API_REGION
  },
  s3: {
    region: process.env.S3_REGION,
    bucketData:
      process.env.NODE_ENV !== 'test'
        ? process.env.NODE_ENV !== 'dev'
          ? process.env.S3_BUCKET_DATA
          : process.env.S3_BUCKET_DEV
        : process.env.S3_BUCKET_TEST,
    bucketDataCdn: process.env.S3_BUCKET_DATA_CDN
  },
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    pw: process.env.DB_PW,
    name:
      process.env.NODE_ENV !== 'test'
        ? process.env.NODE_ENV !== 'dev'
          ? process.env.DB_PROD_NAME
          : process.env.DB_DEV_NAME
        : process.env.DB_TEST_NAME,
    port: process.env.DB_PORT
  },
  googleApi: {
    clientId: process.env.GOOGLE_API_CLIENT_ID,
    secret: process.env.GOOGLE_API_CLIENT_SECRET
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
  },
  url: {
    local: 'http://localhost:4001',
    domain: 'https://api.k-peach.io'
  },
  jwtToken: {
    secretKey: process.env.JWT_SECRET_KEY,
    option: {
      expiresIn: process.env.JWT_EXPIRESIN,
      issuer: process.env.JWT_ISSUER,
      subject: process.env.JWT_SUBJECT
    },
    optionGuest: {
      issuer: process.env.JWT_ISSUER,
      subject: process.env.JWT_SUBJECT
    },
    optionExpired: {
      expiresIn: '0',
      issuer: process.env.JWT_ISSUER,
      subject: process.env.JWT_SUBJECT
    }
  }
};

export default conf;
