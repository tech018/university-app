import express from "express";
import bootstrap from "./bootstrap";
import config from "../config";

import Associations from "../models/associations";

const startServer = async () => {
  const app: express.Application = express();
  bootstrap(app);

  await Associations.sync();

  const message = `Server Started at port ${config.port}`;
  app.listen(config.port, () => {
    console.log(message);
  });
};

startServer().catch((error) => {
  console.error("Error starting the server:", error);
});
