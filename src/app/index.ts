import * as express from "express";
import {NextFunction, Request, Response, Router} from "express";
import * as path from "path";
import * as sassMiddleware from "node-sass-middleware";
import * as createError from 'http-errors';

import homepageRouter from "./controllers/homepage";
import usersRouter from "./controllers/users";

import session from './session'

const router = Router()

session(router)

router.use(sassMiddleware({
    src: path.join(__dirname, '../public'),
    dest: path.join(__dirname, '../public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));
router.use(express.static(path.join(__dirname, '../public')));

router.use('/', homepageRouter);
router.use('/users', usersRouter);

router.use((req, res, next) => {
    next(createError(404));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.use((err, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status ?? 500);
    res.render('error');
});

export default router

