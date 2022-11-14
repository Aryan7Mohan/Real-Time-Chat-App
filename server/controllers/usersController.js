const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const { modelName } = require("../model/userModel");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used.", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used.", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username });

    if (!user)
      return res.json({
        msg: "Incorrect username or password.",
        status: false,
      });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({
        msg: "Incorrect username or password.",
        status: false,
      });

    user = user.toObject();
    delete user.password;
    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

module.exports.getFriends = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(["friends"]);
    const friendDetails = await User.find(
      { _id: { $in: user.friends } },
      { password: 0 }
    );

    return res.json(friendDetails);
  } catch (ex) {
    next(ex);
  }
};

module.exports.getUserDetails = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username }, {password:0});
    if (user) {
      console.log(user)
      return res.json({ status: true, user });
    } else {
      return res.json({ status: false, user });
    }
  } catch (ex) {
    next(ex);
  }
};

module.exports.addFriend = async (req, res, next) => {
  try {
    const { userId1, userId2 } = req.body;
    console.log(userId1, userId2);
    await User.updateOne({ _id: userId1 }, { $push: { friends: userId2 } });
    await User.updateOne({ _id: userId2 }, { $push: { friends: userId1 } });
    return res.json({ status: "Friends Forever! <3" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};
