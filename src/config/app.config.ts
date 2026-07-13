export interface AppEnvironment {
  port: number;
  database: {
    path: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export const AppConfig = (): AppEnvironment => ({
  port: Number(process.env.PORT ?? 3000),
  database: {
    path: process.env.DATABASE_PATH ?? 'booking.sqlite',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-me',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
});
