const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const crypto = require('crypto');

// Creates a token using JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY_TIME,
  });
};

// Creates a token using signToken fn, sends token as a cookie to client-side and sends user data as a response but sets password as undefined for security reasons
const createSendToken = (user, statusCode, req, res) => {
  // 1) Create a token
  const token = signToken(user._id);
  // 2) Set some cookie options
  const cookieOptions = {
    expiresIn: new Date(Date.now() + process.env.JWT_EXPIRY_TIME * 1000),
    // Cookies can only be sent and received not modified
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // 3) Send the token as cookie
  res.cookie('jwt', token, cookieOptions);
  // 3) Set user password as undefined for security purposes
  user.password = undefined;
  // 4) Send token and user data as response
  res.status(statusCode).json({
    status: 'success',
    token,
    user: user,
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please enter email or password', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.passwordVerification(password, user.password)))
    return next(new AppError('Please enter a valid email or password', 401));

  createSendToken(user, 200, req, res);
});

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expiresIn: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) Getting the token from the cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt && req.cookies.jwt !== 'loggedout') {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError('You are not logged in. Please log in to access this.', 401)
    );

  // 2) Verifying the token using our JWT_SECRET

  // (jwt.verify) returns a callback function
  // promisify is used for jwt.verify to return a promise and not a callback fn
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Checking if user still exits i.e user is deleted or not
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('User to which this token belongs no longer exists', 401)
    );
  }

  // 4) Checking if user changed password
  if (currentUser.passwordChanged(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please log in again.', 401)
    );
  }

  req.user = currentUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );

    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(new AppError('There is no user with this email address', 404));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    console.log(resetUrl);
    res.status(200).json({
      status: 'success',
      message: 'Password reset token has been sent to your email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Please try later.',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, 201, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  if (
    !user ||
    !(await user.passwordVerification(req.body.currentPassword, user.password))
  )
    return next(new AppError('Incorrect email or password', 401));

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  createSendToken(user, 201, req, res);
});
