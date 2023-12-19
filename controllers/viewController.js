exports.getMainPage = (req, res) => {
  res.status(200).json({
    message: 'This is the main page.',
  });
};
