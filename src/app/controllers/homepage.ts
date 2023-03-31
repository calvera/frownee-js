import {Request, Response, Router} from 'express'

const router = Router();

router.get('/', function (req: Request, res: Response) {
    if (req.session.views) {
        req.session.views++
    } else {
        req.session.views = 1
    }
    res.render(
        'index', {
            title: 'Express',
            views: req.session.views
        });
});

export default router
