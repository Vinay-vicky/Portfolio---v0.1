import jwt from 'jsonwebtoken';

export const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_for_development_only';

  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.role === 'admin') {
      req.admin = decoded;
      next();
    } else {
      res.status(403).json({ error: 'Forbidden: Admins only' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
