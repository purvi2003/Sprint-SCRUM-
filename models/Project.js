const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {type: String, required: true,unique: true}, 
    // to ensure project names are unique
    description: {type: String, required: false},
    startDate: { type: Date,required: true},
    endDate: {type: Date, required: true}
    
});

module.exports = mongoose.model('Project', projectSchema);
