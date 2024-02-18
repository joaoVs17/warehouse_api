import express from 'express'
import cors from 'cors';
import path from "path";

import { router } from './routes/router';

const app = express();

//DB SETUP
const conn = require('./db/conn');
conn();


//middlewares
app.use(cors());

app.use(express.urlencoded({
    extended: true,
}))

app.use(express.json());

//PORT
const PORT = 3000;

//routes
app.use('/api', router);
app.use('/api/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));


//app listen
app.listen(PORT, () => 'server running')