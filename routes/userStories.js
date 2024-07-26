const express = require('express');
const UserStory = require('../models/UserStory');
const Sprint = require('../models/Sprint');
const Project = require('../models/Project');

module.exports = (io) => {
    const router = express.Router();

    // Test route
    router.get('/test', (req, res) => {
        res.send('UserStory route is working');
    });

    // Get all user stories for a project (with optional sprintName filter)
    router.get('/project/:projectName', async (req, res) => {
        try {
            const project = await Project.findOne({ name: req.params.projectName });
            if (!project) return res.status(404).json({ message: 'Project not found' });

            const query = { projectId: project._id };
            if (req.query.sprintName) {
                const sprint = await Sprint.findOne({ name: req.query.sprintName, projectId: project._id });
                if (!sprint) return res.status(404).json({ message: 'Sprint not found' });
                query.sprintId = sprint._id;
            }

            const userStories = await UserStory.find(query);
            res.json(userStories);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Create a new user story
    router.post('/', async (req, res) => {
        try {
            const { projectName, sprintName, ...userStoryData } = req.body;

            // Find project by name
            const project = await Project.findOne({ name: projectName });
            if (!project) return res.status(404).json({ message: 'Project not found' });

            userStoryData.projectId = project._id;

            // Find sprint by name (optional)
            if (sprintName) {
                const sprint = await Sprint.findOne({ name: sprintName, projectId: project._id });
                if (!sprint) return res.status(404).json({ message: 'Sprint not found' });
                userStoryData.sprintId = sprint._id;
            }

            const userStory = new UserStory(userStoryData);
            await userStory.save();
            io.emit('userStoryCreated', userStory);
            res.status(201).json(userStory);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });
    

    // Update a user story
    router.put('/:id', async (req, res) => {
        try {
            const { projectName, sprintName, ...userStoryData } = req.body;

            // Find project by name
            if (projectName) {
                const project = await Project.findOne({ name: projectName });
                if (!project) return res.status(404).json({ message: 'Project not found' });
                userStoryData.projectId = project._id;

                // Find sprint by name (optional)
                if (sprintName) {
                    const sprint = await Sprint.findOne({ name: sprintName, projectId: project._id });
                    if (!sprint) return res.status(404).json({ message: 'Sprint not found' });
                    userStoryData.sprintId = sprint._id;
                }
            }

            const userStory = await UserStory.findByIdAndUpdate(req.params.id, userStoryData, { new: true });
            if (!userStory) return res.status(404).json({ message: 'User story not found' });
            io.emit('userStoryUpdated', userStory);
            res.json(userStory);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    // Delete a user story
    router.delete('/:id', async (req, res) => {
        try {
            const userStory = await UserStory.findByIdAndDelete(req.params.id);
            if (!userStory) return res.status(404).json({ message: 'User story not found' });
            io.emit('userStoryDeleted', userStory);
            res.json({ message: 'User story deleted' });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    
    return router;

};

