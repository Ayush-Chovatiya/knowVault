import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ name });

    if (existingUser) {
      return res.status(400).json({ message: "username already taken!!" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPass,
    });

    res.status(201).json({ meassage: "User created succesfully!!", user });
  } catch (error) {
    res.status(500).json({ message: error.meassage });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User not found!!" });
    }

    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) {
      res.status(400).json({ message: "Incorrect password!!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Login Succesful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const currUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { registerUser, loginUser, currUser };
