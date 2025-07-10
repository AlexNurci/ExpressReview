const express = require("express");
const router = express.Router();
const { Task, User } = require("../database");

// GET all users
router.get("/", async (req, res) => {
  console.log('get all users route')
  try {
    const users = await User.findAll();
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch users" });
  }
});

// GET a single user by id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// GET all tasks for a user by id
router.get("/:id/tasks", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    const tasks = await user.getTasks();
    res.send(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user's tasks" });
  }
});

//FETCH all users assigned to a given task
router.get("/:id/tasks", async (req, res) => {
  try { 
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const tasks = await Task.findAll({
      include: [{
        model: User,
        where: { id: req.params.id },
        through: { attributes: [] }
      }]
    });
    res.send(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user's task" });
  }
});

// POST a new user
router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).send(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

module.exports = router;
