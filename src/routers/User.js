const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/user/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  //requested changes to update
  const allowedUpdate = ["name", "email", "password", "age"];
  //updates allowed
  const validOperation = updates.every((update) => {
    return allowedUpdate.includes(update);
  });
  // verifying requested update  with allowed update
  if (!validOperation) {
    return res.status(400).send({ error: "Cant update" });
  }
  try {
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    // since middleware bypass this line we have to make some changes to make sure middleware is added

    updates.forEach(async (update) => {
      const user = await User.findById(req.params.id);
      user[update] = req.body[update];
    });
    //[update] is array of value passed to get update
    await user.save();
    //here middleware will get executed

    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "No such User" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
