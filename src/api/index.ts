import * as express from "express";
import {NextFunction, Request, Response, Router} from "express";
import ApiRoutes from "./routes";

const router = Router()

router.use(express.json());
router.use(express.urlencoded({extended: false}));

ApiRoutes.forEach(route => {
    (router)[route.method](route.route, (req: Request, res: Response, next: NextFunction) => {
        const result = (new (route.controller))[route.action](req, res, next)
        res.contentType('application/json')
        if (result instanceof Promise) {
            result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

        } else if (result !== null && result !== undefined) {
            res.json(result)
        }
    })
})

export default router

