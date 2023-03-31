import {config} from 'dotenv'

config({path: __dirname + '/../.env', debug: true})

import * as express from "express"
import * as http from "http";
import * as morgan from "morgan";

import apiRouter from "./api/"
import appRouter from "./app/"
import apollo from './graphql/apollo'
import AppDataSource from "./data-source";
import * as path from "path";

const PORT = process.env.PORT ?? 3000;

const app = express()

app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug');

AppDataSource.initialize().then(() => {

        app.use(morgan('dev'));

        const httpServer = http.createServer(app);
        apollo(app, httpServer).then(() => {

                app.use('/api', apiRouter)
                app.use('/', appRouter)

                httpServer.listen(PORT)

                console.log(`Started at http://localhost:${PORT}/`)
            }
        )
    }
)
