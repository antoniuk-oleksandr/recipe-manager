type AppConfig = {
  port: number;
  jwtSecret: string;
  jwtAccessExpiresIn: number;
  jwtRefreshExpiresIn: number;
  passwordSaltRounds: number;
};

const ensure = <T>(
  value: T | undefined | null,
  name: string,
  defaultValue?: T,
): T => {
  if (value !== undefined && value !== null) return value;
  if (defaultValue !== undefined && defaultValue !== null) return defaultValue;

  throw new Error(`Missing environment variable: ${name}`);
};

export default (): AppConfig => ({
  port: ensure<number>(parseInt(process.env.PORT ?? '', 10), 'PORT', 8080),
  jwtSecret: ensure<string>(process.env.JWT_SECRET, 'JWT_SECRET'),
  jwtAccessExpiresIn: ensure<number>(
    parseInt(process.env.JWT_ACCESS_EXPIRES_IN ?? '', 10),
    'JWT_ACCESS_EXPIRES_IN',
    900,
  ),
  jwtRefreshExpiresIn: ensure<number>(
    parseInt(process.env.JWT_REFRESH_EXPIRES_IN ?? '', 10),
    'JWT_REFRESH_EXPIRES_IN',
    43200,
  ),
  passwordSaltRounds: ensure<number>(
    parseInt(process.env.PASSWORD_SALT_ROUNDS ?? '', 10),
    'PASSWORD_SALT_ROUNDS',
    10,
  ),
});
