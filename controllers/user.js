const User = require("../model/user");
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
