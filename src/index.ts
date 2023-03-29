require('dotenv').config({path: __dirname + '/../.env'})

import * as express from "express"
import * as bodyParser from "body-parser"
import {Request, Response} from "express"
import {Routes} from "./routes"
import apollo from './graphql/apollo'
import {AppDataSource} from "./data-source";

// create express app
const app = express()

app.use(bodyParser.json())

AppDataSource.initialize().then(() => {
        Routes.forEach(route => {
            (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
                const result = (new (route.controller as any))[route.action](req, res, next)
                if (result instanceof Promise) {
                    result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

                } else if (result !== null && result !== undefined) {
                    res.json(result)
                }
            })
        })

        apollo(app).then(() => {
                app.listen(3000)
                console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results")
            }
        )
    }
)
