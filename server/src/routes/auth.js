const {
    login,
    register,
    getAllUsers,
    setAvatar,
    logOut,
} = require("./../controllers/user");

const router = require("express").Router();
router.post("/login", login);
router.post("/register", register);
router.get("/allusers/", getAllUsers);
router.get("/logout/:id", logOut);

module.exports = router;
