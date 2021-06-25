const express = require("express");
const router = express.Router();
const Task = require("../models/task");

router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/task/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/task/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdate = ["description", "completed"];
  const validUpdate = updates.every((update) => {
    return allowedUpdate.includes(update);
  });

  if (!validUpdate) {
    return res.status(400).send({ error: "cant update" });
  }
  try {
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    const task = await Task.findById(req.params.id);
    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();

    if (!task) {
      return res.status(404).send({ error: "No such task present" });
    }
    res.send(task);
  } catch (error) {
    res.status(400).send();
  }
});

router.delete("/task/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send({ error: "No such task" });
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});
module.exports = router;
