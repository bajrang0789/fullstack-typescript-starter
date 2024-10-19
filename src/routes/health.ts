// Health check endpoints
export const healthCheck = {
  liveness: () => ({ status: 'alive' }),
  readiness: () => ({ status: 'ready', timestamp: new Date() })
};
