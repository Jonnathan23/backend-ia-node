import express from 'express'
import morgan from 'morgan';
import cors from 'cors';
import colors from 'colors'

import db from './config/db';
import router from './routes';
import { corsConfig } from './config/cors';

export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        console.log(colors.blue.bold('Conexion exitosa a la BD'))
    } catch (error) {
        //console.log(error)    
        console.log(colors.red.bold('Error al conectar a la BD'))
    }
}

// Express' instance
connectDB()


const app = express();
app.use(cors(corsConfig))

app.use(morgan('dev'));
app.use(express.json());
app.use('/api/ia/history', router)

export default app

