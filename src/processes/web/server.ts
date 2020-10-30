import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import mongoose from "mongoose";
import { config } from "../../config";
import { subscriptionsModule } from "../../modules/subscriptions";
import { logger } from "../../modules/logger";

const app = new Koa();
const router = new Router();

mongoose.connect(config.database.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

router.get("/healthcheck", (context) => {
  context.status = 200;
});

router.post("/subscriptions", async (context) => {
  const { partner, event, address } = context.request.body;
  try {
    const subscription = await subscriptionsModule.subscribe(
      partner,
      event,
      address
    );
    logger.info("subscribed", { partner, event, address });
    context.status = 201;
    context.body = { subscription };
  } catch (error) {
    logger.error("subscription failed", { error });
    context.status = 500;
  }
});

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(config.web.port);
