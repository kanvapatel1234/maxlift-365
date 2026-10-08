import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT for the authenticated user
 * @param {number} userId - The user ID from database
 * @returns {string} Signed JWT token
 */
export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ id: userId }, secret, {
    expiresIn
  });
};
