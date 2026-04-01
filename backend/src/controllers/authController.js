import jwt from 'jsonwebtoken';

export const login = (req, res) => {
  const { username, password } = req.body;

  const validUsername = process.env.ADMIN_USERNAME || 'admin';
  const validPassword = process.env.ADMIN_PASSWORD || 'secret123';
  const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_for_development_only';

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (username === validUsername && password === validPassword) {
    const token = jwt.sign({ role: 'admin' }, jwtSecret, { expiresIn: '1d' });
    return res.status(200).json({ token, message: 'Logged in successfully' });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
};
