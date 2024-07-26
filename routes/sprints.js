const express = require('express');
const Sprint = require('../models/Sprint');

module.exports = (io) => {
    const router = express.Router();

    // Test route
    router.get('/test', (req, res) => {
        res.send('Sprint route is working');
    });

    // Get all sprints for a project
    router.get('/project/:projectName', async (req, res) => {
        try {
            const project = await Project.findOne({ name: req.params.projectName });
            if (!project) return res.status(404).json({ message: 'Project not found' });

            const sprints = await Sprint.find({ projectId: project._id });
            res.json(sprints);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Create a new sprint
    router.post('/', async (req, res) => {
        try {
            const { projectName, ...sprintData } = req.body;

            // Find project by name
            const project = await Project.findOne({ name: projectName });
            if (!project) return res.status(404).json({ message: 'Project not found' });

            sprintData.projectId = project._id;

            const sprint = new Sprint(sprintData);
            await sprint.save();
            io.emit('sprintCreated', sprint);
            res.status(201).json(sprint);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    // Update a sprint
    router.put('/:id', async (req, res) => {
        try {
            const { projectName, ...sprintData } = req.body;

            // Find project by name
            if (projectName) {
                const project = await Project.findOne({ name: projectName });
                if (!project) return res.status(404).json({ message: 'Project not found' });
                sprintData.projectId = project._id;
            }

            const sprint = await Sprint.findByIdAndUpdate(req.params.id, sprintData, { new: true });
            if (!sprint) return res.status(404).json({ message: 'Sprint not found' });
            io.emit('sprintUpdated', sprint);
            res.json(sprint);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    // Delete a sprint
    router.delete('/:id', async (req, res) => {
        try {
            const sprint = await Sprint.findByIdAndDelete(req.params.id);
            if (!sprint) return res.status(404).json({ message: 'Sprint not found' });
            io.emit('sprintDeleted', sprint);
            res.json({ message: 'Sprint deleted' });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });
    

    return router;

};
