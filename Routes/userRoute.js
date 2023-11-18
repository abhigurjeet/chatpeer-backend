const { Router } = require("express");
const userhandler = require("../Controllers/UserHandler");
const verifyToken = require("../Middlewares/verifytoken");
const router = Router();

router.post("/", userhandler.createNewUser);
router.post("/login", userhandler.getUser);
router.get("/allusers", verifyToken, userhandler.getAllUsers);
router.post("/createmessage", verifyToken, userhandler.createMessage);
router.post("/getmessages", verifyToken, userhandler.getAllMessages);
router.get("/getid", verifyToken);
module.exports = router;
