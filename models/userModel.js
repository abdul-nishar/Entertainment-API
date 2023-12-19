const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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

// 🔴 Comment out this middleware before importing data because it hashes the password again

// This pre middleware is responsible for hashing password for new documents or on password change
userSchema.pre('save', async function (next) {
  // This condition indicates that middleware will be skipped ('only') when password is not modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  // This step is necessary to ensure no leakage of password
  this.passwordConfirm = undefined;
  next();
});

// This pre middleware is responsible for ensuring password modification
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  // Here, we subtract 1 sec because sometimes this middleware runs before the token is actually created and we need passwordChangedAt to check the expiry time of the token
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.passwordVerification = async (
  candidatePassword,
  userPassword
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChanged = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTime = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedTime;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // Creating random string using crypto module
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Encrypting and storing in user document
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Setting expiry time for the token
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
