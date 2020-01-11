const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const PORT = process.env.PORT || 5000;
const app = express();

const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const articlesRoutes = require('./routes/articles.routes');

// middlewares
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());

// main routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/articles', articlesRoutes);

// static files
app.use(express.static('static'));

// error handling
app.use((err, req, res, next) => {
    const {statusCode = 500, message, errors} = err;
    return res.status(statusCode).json({message, errors});
});

mongoose
    .connect(process.env.MONGO_DB_URI, {useNewUrlParser: true})
    .then(() => {
        app.listen(PORT);
        console.log(`Server listening on port ${PORT}`);
    })
    .catch(error => {
        console.log('Connection error', error)
    });