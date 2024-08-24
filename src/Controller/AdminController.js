const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Admin = require("../Models/AdminModel");
dotenv.config();

const CreateAdmin = async (req, res) => {
  console.log(req.body);
  const { UserName, Password } = req.body;
  const admin = new Admin({
    _id: new mongoose.Types.ObjectId(),
    UserName: UserName,
    Password: Password,
  });
  return admin
    .save()
    .then((admin) => res.status(201).json({ admin }))
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

const LoginAdmin = async (req, res) => {
  const { UserName, Password } = req.body;
  console.log("req.body:", req.body);
  try {
    const admin = await Admin.findOne({ UserName: UserName });
    console.log(admin, "admin");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    } else if (admin.Password == Password) {
      return res.status(200).json({ message: "Admin found" });
    } else {
      return res.status(404).json({ message: "Wrong id and pass" });
    }
  } catch (error) {
    console.error("Error Login", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  CreateAdmin,
  LoginAdmin,
};
