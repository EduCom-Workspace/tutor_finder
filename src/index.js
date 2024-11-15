import Express from 'express';
import dotenv from 'dotenv';
import router from './routes/index.js';


dotenv.config();
const app = Express();

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

// user routes here
app.use('/', router);


app.listen(port, host, () => {
    console.log(`Server is running. visit http://${host}:${port}/`);
})