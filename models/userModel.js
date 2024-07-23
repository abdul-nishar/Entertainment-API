import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

/**
 * User schema for the application.
 * @typedef {Object} User
 * @property {string} name - The name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} [photo] - URL of the user's photo.
 * @property {'admin' | 'user'} [role='user'] - The role of the user, either 'admin' or 'user'.
 * @property {string} password - The password of the user.
 * @property {string} passwordConfirm - The confirmation of the password.
 * @property {Date} [passwordChangedAt] - The date when the password was last changed.
 * @property {string} [passwordResetToken] - The token used for password reset.
 * @property {Date} [passwordResetExpires] - The expiry date of the password reset token.
 * @property {boolean} [active=true] - Whether the user account is active.
 */

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please tell us your email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email address'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

/**
 * Pre-save middleware to hash the password.
 * @param {Function} next - Callback function to pass control to the next middleware.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

/**
 * Pre-save middleware to set passwordChangedAt if password was modified.
 * @param {Function} next - Callback function to pass control to the next middleware.
 */
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

/**
 * Method to verify if the provided password matches the stored password.
 * @param {string} candidatePassword - The password provided by the user.
 * @param {string} userPassword - The stored hashed password.
 * @returns {Promise<boolean>} - Whether the passwords match.
 */
userSchema.methods.passwordVerification = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * Method to check if the password was changed after a specific JWT token's timestamp.
 * @param {number} JWTTimestamp - The timestamp from the JWT token.
 * @returns {boolean} - Whether the password was changed after the token was issued.
 */
userSchema.methods.passwordChanged = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTime = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedTime;
  }
  return false;
};

/**
 * Method to create a password reset token and store it in the user document.
 * @returns {string} - The password reset token.
 */
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
  return resetToken;
};

/**
 * Pre-query middleware to filter out inactive users.
 * @param {Function} next - Callback function to pass control to the next middleware.
 */
userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

const User = mongoose.model('User', userSchema);

export default User;