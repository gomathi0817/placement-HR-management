import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'gv_hr_placement_secret_key_2026';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. Please login.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired session token. Please login again.' });
    }
    req.user = user;
    next();
  });
}
