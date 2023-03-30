import {config} from 'dotenv'
import * as express from "express"
import {NextFunction, Request, Response} from "express"
import * as bodyParser from "body-parser"
import {Routes} from "./routes"
import apollo from './graphql/apollo'
import {AppDataSource} from "./data-source";
import * as http from "http";

config({path: __dirname + '/../.env'})

const app = express()

app.use(bodyParser.json())

const PORT = process.env.PORT ?? 3000;

AppDataSource.initialize().then(() => {
        Routes.forEach(route => {
            (app)[route.method](route.route, (req: Request, res: Response, next: NextFunction) => {
                const result = (new (route.controller))[route.action](req, res, next)
                res.contentType('application/json')
                if (result instanceof Promise) {
                    result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

                } else if (result !== null && result !== undefined) {
                    res.json(result)
                }
            })
        })

        const httpServer = http.createServer(app);
        apollo(app, httpServer).then(() => {
                httpServer.listen(PORT)
                console.log(`Started at http://localhost:${PORT}/`)
            }
        )
    }
)
