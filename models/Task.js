const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['New', 'In Progress', 'Ready For Test', 'Closed','Info'], default: 'New' },
    userStory: { type: mongoose.Schema.Types.ObjectId, ref: 'UserStory',required: true },
    sprintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint', required: true },
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Task', TaskSchema);


