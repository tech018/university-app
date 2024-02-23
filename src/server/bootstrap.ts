import express from "express";
import parser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import appConfig from "../config/index";
import authRoutes from "../routes/auth.route";
import morgan from "morgan";

const bootstrap = (application: express.Application): void => {
  application.disable("x-powered-by");
  application.use(cors());
  application.use(cors({ optionsSuccessStatus: 200 }));
  application.use(express.static(__dirname + "/files"));
  application.use(parser.urlencoded({ extended: true }));
  application.use(parser.json());
  application.use(
    morgan(appConfig.env === "development" ? "dev" : appConfig.env)
  );
  application.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
  application.use("/auth/v1", authRoutes);
};

export default bootstrap;
