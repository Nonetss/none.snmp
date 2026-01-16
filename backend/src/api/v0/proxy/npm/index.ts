import { OpenAPIHono } from '@hono/zod-openapi';
import npmGetRouter from './get/get.index';
import npmAuthRouter from './auth';

const npmProxyRouter = new OpenAPIHono();

npmProxyRouter.route('/', npmGetRouter);
npmProxyRouter.route('/npm', npmAuthRouter);

export default npmProxyRouter;
