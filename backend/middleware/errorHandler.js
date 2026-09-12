export function errorHandler(err, _req, res, _next) {
  if (err.name === 'ZodError') return res.status(400).json({ error: 'Invalid canvas data', details: err.issues });
  if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
  console.error(err); res.status(500).json({ error: 'Internal server error' });
}
