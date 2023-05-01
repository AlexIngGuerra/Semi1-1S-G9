import express from "express";
import morgan from "morgan";
import cors from "cors";

import indexRoutes from "./routes/index.routes.js";
import userRoutes from "./routes/user.routes.js";
import publicacionRoutes from "./routes/publicacion.routes.js"

const app = express();
//Cors
var corsOptions = {
  origin: '*',
}

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors(corsOptions))

// Routes
app.use("/", indexRoutes);
app.use("/", userRoutes);
app.use("/", publicacionRoutes)

app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;