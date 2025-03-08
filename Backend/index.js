import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from './models/Users.js';
import RatingModel from './models/Rating.js';
import adminRoute from './routes/admin.js';

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());

// ✅ Dynamic CORS Configuration
const allowedOrigins = ['https://movie-rating-ui.vercel.app'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Use admin routes for handling user data and ratings
app.use('/admin', adminRoute);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// JWT Middleware for verifying tokens
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract JWT token from the Authorization header
  if (!token) return res.status(401).json({ authenticated: false, message: 'No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token with JWT_SECRET
    req.user = decoded; // Attach user data to request object
    next();
  } catch (error) {
    console.error('❌ Invalid token:', error);
    res.status(401).json({ authenticated: false, message: 'Invalid token' });
  }
};

// Default route to check API status
app.get('/', (req, res) => {
  res.send('🎬 Movie Rating API is running 🚀');
});

// Sign-up API
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUsers = await UserModel.find();

    // Auto-generate userId
    const userId = existingUsers.length === 0 ? 1 : Math.max(...existingUsers.map((user) => user.userId)) + 1;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password

    const newUser = new UserModel({ username, email, password: hashedPassword, userId });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', userId });
  } catch (error) {
    console.error('❌ Error signing up user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Sign-in API (JWT Authentication)
app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT Token (valid for 1 hour)
    const token = jwt.sign({ userId: user.userId, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token, userId: user.userId, username: user.username });
  } catch (error) {
    console.error('❌ Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add Rating API
app.post('/showmore', async (req, res) => {
  try {
    const { userId, username, rating, moviename, comment, mediaType, mediaId, day, month, year } = req.body;
    const ratingId = (await RatingModel.countDocuments()) + 101; // Auto-generate ratingId

    const newRating = new RatingModel({ ratingId, userId, username, rating, moviename, comment, mediaType, mediaId, day, month, year });
    await newRating.save();

    res.status(201).json({ message: 'Rating saved successfully', ratingId });
  } catch (error) {
    console.error('❌ Error saving rating:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API for checking authentication status (JWT Protected)
app.get('/api/authenticated', verifyToken, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

// Fetch ratings API by mediaId
app.get('/ratings', async (req, res) => {
  try {
    const { mediaId } = req.query;
    const ratings = await RatingModel.find({ mediaId });
    res.json(ratings);
  } catch (error) {
    console.error('❌ Error fetching ratings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server (for development environment)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
  });
}

export default app; // Export app for Vercel deployment
