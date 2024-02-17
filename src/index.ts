import express from 'express'
import cors from 'cors';

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


//app listen
app.listen(PORT, () => 'server running')