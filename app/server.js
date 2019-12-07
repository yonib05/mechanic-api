import express from 'express';
import config from './config';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path'
import * as AppointmentModel from './models/appointment';
import AppointmentRoutes from './routes/appointments';

const app = express();
const port = process.env.PORT || 8080;
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'), {flags: 'a'}
);
const mongoURI = config.mongodb.mongoURI;

// mongoose instance connection url connection
mongoose.connect( mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(
    (res) => {
        console.log("Connected to Database Successfully.")
    }
).catch(() => {
    console.log("Connection to database failed.");
    throw new Error('Can not connect to database!')
});


app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


AppointmentRoutes(app); //register the route

app.listen(port);

console.log('Mechanic API server started on: ' + port);

export default module.exports = app;