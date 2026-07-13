export interface AppEnvironment {
  port: number;
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export const AppConfig = (): AppEnvironment => ({
  port: Number(process.env.PORT ?? 3000),
  database: {
    url:
      process.env.DATABASE_URL ??
      'postgresql://postgres:1234@localhost:5432/booking_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-me',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
});
