const express = require('express');
const Project = require('../models/Project');


module.exports = (io) => {
    const router = express.Router();

    // Test route
    router.get('/test', (req, res) => {
        res.send('Project route is working');
    });

    // Create a new project
    router.post('/', async (req, res) => {
        try {
            const project = new Project(req.body);
            await project.save();
            io.emit('projectCreated', project);
            res.status(201).json(project);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    
    // Get all projects
    router.get('/', async (req, res) => {
        try {
            const projects = await Project.find();
            res.json(projects);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Get a single project by ID
    router.get('/:id', async (req, res) => {
        try {
            const project = await Project.findById(req.params.id);
            if (!project) return res.status(404).json({ message: 'Project not found' });
            res.json(project);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // Update a project
    router.put('/:id', async (req, res) => {
        try {
            const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!project) return res.status(404).json({ message: 'Project not found' });
            io.emit('projectUpdated', project);
            res.json(project);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    // Delete a project
    router.delete('/:id', async (req, res) => {
        try {
            const project = await Project.findByIdAndDelete(req.params.id);
            if (!project) return res.status(404).json({ message: 'Project not found' });
            io.emit('projectDeleted', project);
            res.json({ message: 'Project deleted' });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });


    return router;
};
