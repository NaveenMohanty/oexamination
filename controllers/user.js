const User = require("../model/user");

exports.getUserById = (req, res, next, id) => {
  User.findById(id, function (err, user) {
    if (err || !user) {
      return res.status(404).json({
        success: false,
        error: "No user was found in DB",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  const { profile } = req;
  profile.salt = undefined;
  profile.encry_password = undefined;
  res.json({ success: true, user: profile });
};

exports.updateUser = (req, res) => {
  const { profile, body } = req;
  let data = Object.keys(body);
  data.map((v) => {
    profile[v] = body[v];
  });
  profile.save((err, user) => {
    if (err || !user) {
      return res
        .status(404)
        .json({ success: false, error: "Unable to update." });
    }
    user.salt = undefined;
    user.encry_password = undefined;
    console.log();
    res.json({ success: true, user });
  });
};
