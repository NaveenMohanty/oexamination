const User = require("../model/user");
exports.getUserById = (req, res, next, id) => {
  User.findById(id, function (err, user) {
    if (err || !user) {
      return res.status(404).json({
        error: "No user was found in DB",
      });
    }
    req.profile = user;
    next();
  });
};
exports.userCreate = () => {
  User.create(
    {
      name: "Naveen Mohanty",
      email: "nav3@nav.com",
      password: "1212",
      examhosted: [{ host: "608abfe595d213128fab3b81" }],
    },
    function (err, data) {
      if (err) console.log(err);
      else console.log(data);
      // saved!
    }
  );
};
