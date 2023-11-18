const User = require("../Models/user");
const Message = require("../Models/message");
const jwt = require("jsonwebtoken");

exports.createNewUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "email already exists" });
    }
    const newUser = new User({ email, password });
    await newUser.save();
    return res.status(201).json("sign up successful");
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

exports.getUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.header("Authorization", token);
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.body;
    const senderEmail = await User.findOne({ email: sender });
    const receiverEmail = await User.findOne({ email: receiver });

    const messages = await Message.find({
      $or: [
        { sender: senderEmail._id, receiver: receiverEmail._id },
        { sender: receiverEmail._id, receiver: senderEmail._id },
      ],
    });
    return res.send(messages);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
exports.createMessage = async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;

    const senderEmail = await User.findOne({ email: sender });
    const receiverEmail = await User.findOne({ email: receiver });

    // Create a new message instance
    const newMessage = new Message({
      sender: senderEmail._id,
      receiver: receiverEmail._id,
      content,
      timestamp: Date.now(),
    });
    await newMessage.save();

    return res.send(newMessage);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
