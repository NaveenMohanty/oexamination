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
    const { name, email, userinfo } = user;
    res.json({
      success: true,
      data: { name, email, userinfo },
      message: "User updated successfully",
    });
  });
};
