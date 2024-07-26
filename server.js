const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');

const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);


// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

//importing routes
const sprintRoutes = require('./routes/sprints')(io);
const userStoryRoutes = require('./routes/userStories')(io);
const taskRoutes = require('./routes/tasks')(io);
const projectRoutes = require('./routes/projects')(io);

//using routes
app.use('/api/sprints', sprintRoutes);
app.use('/api/userStories', userStoryRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/sprint-backend');
    
const db = mongoose.connection;
db.once('open', () => {
    console.log('Connected to MongoDB');
});

db.on('error', (error) => console.error('MongoDB connection error:', error));


// WebSocket connection
io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});