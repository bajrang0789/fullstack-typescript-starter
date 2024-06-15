// Request validation middleware using Zod
export const validateRequest = (schema: any) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: 'Validation failed' });
    }
  };
};
