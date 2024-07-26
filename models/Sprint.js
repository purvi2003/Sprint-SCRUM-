const mongoose = require('mongoose');

const SprintSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true}, 
    // Ensure sprint names are unique }
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    userStories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserStory' }],
    projectId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project'}
});

module.exports = mongoose.model('Sprint', SprintSchema);
