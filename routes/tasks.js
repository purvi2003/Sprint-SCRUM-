const express = require('express');
const Task = require('../models/Task');
const UserStory = require('../models/UserStory');
const Project = require('../models/Project');
const Sprint = require('../models/Sprint');


module.exports = (io) => {
    const router = express.Router();

    // Test route
    router.get('/test', (req, res) => {
        res.send('Task route is working');
    });

    // Get all tasks for a user story
    router.get('/project/:projectName/sprint/:sprintName/userStory/:userStoryName', async (req, res) => {
        try {
            const project = await Project.findOne({ name: req.params.projectName });
            if (!project) return res.status(404).json({ message: 'Project not found' });

            const sprint = await Sprint.findOne({ name: req.params.sprintName, projectId: project._id });
            if (!sprint) return res.status(404).json({ message: 'Sprint not found' });

            const userStory = await UserStory.findOne({ name: req.params.userStoryName, sprintId: sprint._id });
            if (!userStory) return res.status(404).json({ message: 'User story not found' });

            const tasks = await Task.find({ userStoryId: userStory._id });
            res.json(tasks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Create a new task
    router.post('/', async (req, res) => {
        try {
            const { projectName, sprintName, userStoryName, ...taskData } = req.body;

            // Find project by name
            const project = await Project.findOne({ name: projectName });
            if (!project) return res.status(404).json({ message: 'Project not found' });

            // Find sprint by name
            const sprint = await Sprint.findOne({ name: sprintName, projectId: project._id });
            if (!sprint) return res.status(404).json({ message: 'Sprint not found' });

            // Find user story by name
            const userStory = await UserStory.findOne({ name: userStoryName, sprintId: sprint._id });
            if (!userStory) return res.status(404).json({ message: 'User story not found' });

            taskData.projectId = project._id;
            taskData.sprintId = sprint._id;
            taskData.userStoryId = userStory._id;

            const task = new Task(taskData);
            await task.save();
            io.emit('taskCreated', task);
            res.status(201).json(task);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    
    // Update a task
    router.put('/:id', async (req, res) => {
        try {
            const { projectName, sprintName, userStoryName, ...taskData } = req.body;

            // Find project by name
            if (projectName) {
                const project = await Project.findOne({ name: projectName });
                if (!project) return res.status(404).json({ message: 'Project not found' });
                taskData.projectId = project._id;

                // Find sprint by name
                if (sprintName) {
                    const sprint = await Sprint.findOne({ name: sprintName, projectId: project._id });
                    if (!sprint) return res.status(404).json({ message: 'Sprint not found' });
                    taskData.sprintId = sprint._id;

                    // Find user story by name
                    if (userStoryName) {
                        const userStory = await UserStory.findOne({ name: userStoryName, sprintId: sprint._id });
                        if (!userStory) return res.status(404).json({ message: 'User story not found' });
                        taskData.userStoryId = userStory._id;
                    }
                }
            }

            const task = await Task.findByIdAndUpdate(req.params.id, taskData, { new: true });
            if (!task) return res.status(404).json({ message: 'Task not found' });
            io.emit('taskUpdated', task);
            res.json(task);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    // Delete a task
    router.delete('/:id', async (req, res) => {
        try {
            const task = await Task.findByIdAndDelete(req.params.id);
            if (!task) return res.status(404).json({ message: 'Task not found' });
            io.emit('taskDeleted', task);
            res.json({ message: 'Task deleted' });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });
    
    
    return router;

};
