export interface EnvironmentVariables {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWT_ACCESS_SECRET?: string;
  JWT_SECRET?: string;
  JWT_REFRESH_SECRET?: string;
  REDIS_URL?: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const errors: string[] = [];

  const requiredVars = ['DATABASE_URL'];

  for (const v of requiredVars) {
    if (!config[v]) {
      errors.push(`Missing required environment variable: ${v}`);
    }
  }

  // Ensure at least one JWT secret is provided
  if (!config.JWT_ACCESS_SECRET && !config.JWT_SECRET) {
    errors.push('Missing required JWT secret: either JWT_ACCESS_SECRET or JWT_SECRET must be configured.');
  }

  if (errors.length > 0) {
    throw new Error(`\n[Environment Configuration Error]\n${errors.join('\n')}\n`);
  }

  return config;
}
