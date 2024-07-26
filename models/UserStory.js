const mongoose = require('mongoose');

const UserStorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    sprintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint', required: false },// Making sprintId optional
    projectId: {type: mongoose.Schema.Types.ObjectId, ref: 'Project',required: true}
});

module.exports = mongoose.model('UserStory', UserStorySchema);
