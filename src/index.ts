import {config} from 'dotenv'
import * as express from "express"
import {NextFunction, Request, Response} from "express"
import * as bodyParser from "body-parser"
import * as http from "http";
import * as path from "path";
import * as createError from 'http-errors';
import * as cookieParser from "cookie-parser";
import * as sassMiddleware from "node-sass-middleware";
import * as morgan from "morgan";

import usersRouter from "../src/routes/users";
import indexRouter from "../src/routes/index";

import {Routes} from "./routes"
import apollo from './graphql/apollo'
import {AppDataSource} from "./data-source";

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

                app.set('views', path.join(__dirname, 'views'));
                app.set('view engine', 'pug');

                app.use(morgan('dev'));
                app.use(express.json());
                app.use(express.urlencoded({extended: false}));
                app.use(cookieParser());
                app.use(sassMiddleware({
                    src: path.join(__dirname, 'public'),
                    dest: path.join(__dirname, 'public'),
                    indentedSyntax: true, // true = .sass and false = .scss
                    sourceMap: true
                }));
                app.use(express.static(path.join(__dirname, 'public')));

                app.use('/', indexRouter);
                app.use('/users', usersRouter);

                app.use((req, res, next) => {
                    next(createError(404));
                });

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                app.use((err, req: Request, res: Response, next: NextFunction) => {
                    res.locals.message = err.message;
                    res.locals.error = req.app.get('env') === 'development' ? err : {};

                    res.status(err.status ?? 500);
                    res.render('error');
                });

                httpServer.listen(PORT)

                console.log(`Started at http://localhost:${PORT}/`)
            }
        )
    }
)
