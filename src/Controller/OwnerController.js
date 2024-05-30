const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Owner = require("../Models/OwnerModel");

dotenv.config();

const CreateOwner = async (req, res) => {
  console.log(req.body);
  const { Address } = req.body;

  const owner = new Owner({
    _id: new mongoose.Types.ObjectId(),
    Address: Address,
  });

  return owner
    .save()
    .then((owner) => res.status(201).json({ owner }))
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

const readAll = (req, res) => {
  Owner.find()
    .exec()
    .then((Owner) => res.status(200).json({ Owner }))
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

const UpdateOwner = (req, res) => {
  const { address } = req.params;
  const { newAddress } = req.body;

  console.log("Address:", address);

  try {
    const owner = owner.findOne({ address });

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    if (newAddress) owner.address = newAddress;

    owner.save();

    res.status(200).json({ message: "Owner updated successfully", owner });
  } catch (error) {
    console.error("Error updating owner:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  CreateOwner,
  readAll,
  UpdateOwner,
};
