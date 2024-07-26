const express = require('express');
const Project = require('../models/Project');
const Sprint = require('../models/Sprint');
const UserStory = require('../models/UserStory');
const Task = require('../models/Task');

const router = express.Router();

// Search projects by name or description
router.get('/projects', async (req, res) => {
    try {
        const { query } = req.query;
        const projects = await Project.find({
            $or: [
                { name: new RegExp(query, 'i') },
                { description: new RegExp(query, 'i') }
            ]
        });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search sprints by name or description
router.get('/sprints', async (req, res) => {
    try {
        const { query, projectId } = req.query;
        const sprints = await Sprint.find({
            projectId,
            $or: [
                { name: new RegExp(query, 'i') },
                { description: new RegExp(query, 'i') }
            ]
        });
        res.json(sprints);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search user stories by name or description
router.get('/userStories', async (req, res) => {
    try {
        const { query, sprintId } = req.query;
        const userStories = await UserStory.find({
            sprintId,
            $or: [
                { name: new RegExp(query, 'i') },
                { description: new RegExp(query, 'i') }
            ]
        });
        res.json(userStories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search tasks by name or description
router.get('/tasks', async (req, res) => {
    try {
        const { query, userStoryId } = req.query;
        const tasks = await Task.find({
            userStoryId,
            $or: [
                { title: new RegExp(query, 'i') },
                { description: new RegExp(query, 'i') }
            ]
        });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
