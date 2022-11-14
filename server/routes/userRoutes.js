const { register, login, getAllUsers, getFriends, addFriend, getUserDetails } = require("../controllers/usersController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get-friends/:id", getFriends);
router.post("/add-friend", addFriend);
router.get("/allUsers/:id", getAllUsers);
router.post("/get-user-details/", getUserDetails);

module.exports = router;