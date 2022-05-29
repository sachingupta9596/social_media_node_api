const router = require("express").Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User");

router.get("/", (req, res) => {
  res.send("users ruter");
});
// update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
      try {
        const user = await User.findByIDANdUpdate(req.params.id, {
          $set: req.body,
        });
        res.status(200).json("account has been updated");
      } catch (error) {
        return res.status(500).json(error);
      }
    }
  } else {
    return res.status(403).json("you can update only your aacount");
  }
});
// delete user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        res.status(200).json("account has been updated");
      } catch (error) {
        return res.status(500).json(error);
      }
    }
  } else {
    return res.status(403).json("you can update only your aacount");
  }
});
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("account has been deleted");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("you can delete only your aacount");
  }
});
//get a user
router.get("/:id", async (req, res) => {
  try {
    const user = User.findById(req.params.id);
    //destructuring the user object and only take other object not password and updatedAt
    const { password, updatedAt, ...other } = user._doc; // ._doc contain the full object
    res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(error);
  }
});

// follow a user

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = User.findById(req.params.id);
      const currentUser = User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updatedOne({ $push: { followers: req.body.userId } });
        await currentUser.updatedOne({
          $push: { followings: req.params.id },
        });
        res.status(200).json("user followed");
      } else {
        res.status(403).json("you are already following it");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a user

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = User.findById(req.params.id);
      const currentUser = User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updatedOne({ $push: { followers: req.body.userId } });
        await currentUser.updatedOne({
          $pull: { followings: req.params.id },
        });
        res.status(200).json("user unfollowed");
      } else {
        res.status(403).json("you are unfollowing it");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

module.exports = router;
