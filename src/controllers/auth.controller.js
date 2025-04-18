import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js'; 
import { jwtSecret, jwtExpiration } from '../config/jwt.js'; 

class AuthController {
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      // Find user by email using the in-memory model
      const user = await UserModel.getUserByEmail(email);

      // Check if user exists and if the plain text password matches
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // User authenticated, create JWT payload 
      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type
      };

      // Sign the JWT
      const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiration });

      // Send the token and user info (without password) back to the client
      res.json({
          message: "Login successful",
          token: token,
          user: payload // Send user info without password
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error during login' });
    }
  }
}

export default AuthController; 