// Prometheus metrics collection

interface Metrics {
  requestCount: number;
  errorCount: number;
  responseTime: number[];
  [key: string]: number | number[];
}

export const metrics: Metrics = {
  requestCount: 0,
  errorCount: 0,
  responseTime: []
};

export const recordMetric = (metric: string, value: number): void => {
  if (metric === 'responseTime') {
    (metrics.responseTime as number[]).push(value);
  } else {
    metrics[metric] = value;
  }
};

export const incrementMetric = (metric: 'requestCount' | 'errorCount'): void => {
  metrics[metric]++;
};

export const getMetrics = (): Readonly<Metrics> => {
  return { ...metrics };
};
