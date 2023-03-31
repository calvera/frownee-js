import {TypeormStore} from "connect-typeorm";
import {Router} from "express";
import AppDataSource from "../data-source";
import * as ExpressSession from "express-session";

import {Session} from "../entity/Session";

declare module 'express-session' {
    interface SessionData {
        views: number | null;
    }
}

function session(router: Router) {
    const sessionRepository = AppDataSource.getRepository(Session);

    router.use(
        ExpressSession({
            resave: false,
            saveUninitialized: false,
            rolling: true,
            store: new TypeormStore({
                cleanupLimit: 2,
                ttl: 14 * 24 * 60 * 60, // 14 days
            }).connect(sessionRepository),
            secret: process.env.COOKIE_SECRET
        })
    );
}

export default session