export type HealthDto = {
  status: 'ok' | 'error';
  services: Record<string, 'ok' | 'error'>;
};
