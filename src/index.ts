import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import router from './route';
import ToDoListController from './controller/todoListController';
import ToDoItemController from './controller/todoItemController';
import { initDb, Conn } from './db';

dotenv.config();

if(!process.env.APP_PORT) {
    console.error(`Error to get ports`);
    process.exit(1);
}

const PORT: number = parseInt(process.env.APP_PORT as string);
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
});

if(!process.env.DATABASE_URL) {
    initialize();
}

export async function initialize() {
    await initDb();
    new ToDoListController(Conn);
    new ToDoItemController(Conn);
}


export { app }; // for test