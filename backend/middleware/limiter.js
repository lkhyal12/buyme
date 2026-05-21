const requests = {};

export function limiter(req, res, next) {
  const key = `${req.url}:${req.ip}`;
  if (!requests[key]) requests[key] = [];
  requests[key] = requests[key].filter((r) => Date.now() - r < 1000 * 60);
  if (requests[key].length > 10)
    return res.status(429).json({ message: "Too many requests" });
  requests[key].push(Date.now());
  next();
}
