import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

const signAccessToken = (userId, role) =>
  jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });

const signRefreshToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, isActive: true }).select('+password +refreshToken');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const accessToken = signAccessToken(user._id, user.role);
  const refreshToken = signRefreshToken(user._id);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  await AuditLog.create({
    user: user._id,
    action: 'LOGIN',
    resource: 'User',
    resourceId: user._id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  res
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({
      success: true,
      message: 'Login successful',
      data: { user: user.toJSON(), accessToken },
    });
};

export const logout = async (req, res) => {
  const user = await User.findById(req.user._id).select('+refreshToken');
  if (user) {
    user.refreshToken = null;
    await user.save();
  }
  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json({ success: true, message: 'Logged out successfully.' });
};

export const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ success: false, message: 'No refresh token.' });

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.userId).select('+refreshToken');

  if (!user || user.refreshToken !== token) {
    return res.status(401).json({ success: false, message: 'Invalid refresh token.' });
  }

  const accessToken = signAccessToken(user._id, user.role);
  const newRefreshToken = signRefreshToken(user._id);
  user.refreshToken = newRefreshToken;
  await user.save();

  res
    .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
    .cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({ success: true, data: { accessToken } });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('studentProfile')
    .populate('facultyProfile');
  res.json({ success: true, data: user });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  // Always return success to prevent email enumeration
  if (!user) {
    return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // In production, send email here
  res.json({
    success: true,
    message: 'If that email exists, a reset link has been sent.',
    ...(process.env.NODE_ENV === 'development' && { resetToken }),
  });
};

export const resetPassword = async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ success: false, message: 'Token is invalid or expired.' });

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json({ success: true, message: 'Password reset successful. Please login.' });
};

export const changePassword = async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(req.body.currentPassword))) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
  }
  user.password = req.body.newPassword;
  await user.save();
  res.json({ success: true, message: 'Password changed successfully.' });
};
