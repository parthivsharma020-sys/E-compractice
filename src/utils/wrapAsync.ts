import { type Response,type Request ,type NextFunction ,type ErrorRequestHandler } from "express"
const wrapAsync = (fn: Function) => {
    return function (req: Request, res: Response, next: NextFunction) {
        fn(req, res, next).catch((err:any) => {
            next(err);
       })
    }
}

export default wrapAsync;