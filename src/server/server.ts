import express from "express";
import bootstrap from "./bootstrap";

export const application: express.Application = express();
bootstrap(application);
