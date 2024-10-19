// Prometheus metrics collection
export const metrics = {
  requestCount: 0,
  errorCount: 0,
  responseTime: [] as number[]
};

export const recordMetric = (metric: string, value: number) => {
  metrics[metric] = value;
};
