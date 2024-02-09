import { Application, Session, oakCors } from "./deps.js";
import { aclMiddleware } from "./middlewares/aclMiddleware.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { renderMiddleware } from "./middlewares/renderMiddleware.js";
import { userMiddleware } from "./middlewares/userMiddleware.js";
import { serveStaticMiddleware } from "./middlewares/serveStaticMiddleware.js";
import { router } from "./routes/routes.js";

const app = new Application();

app.use(Session.initMiddleware());

app.use(errorMiddleware);
app.use(aclMiddleware);
app.use(userMiddleware);
app.use(serveStaticMiddleware);
app.use(renderMiddleware);
app.use(oakCors());

app.use(router.routes());

export { app };
