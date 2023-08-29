import express from "express";
import productsRoute from "./server/routes/productsRoute.js";
import makeRoute from "./server/routes/makeRoute.js";
import modelRoute from "./server/routes/modelRoute.js";
import yearRoute from "./server/routes/yearRoute.js";
import categoriesRoute from "./server/routes/categoriesRoute.js";
import usersRoute from "./server/routes/usersRoute.js";
import cors from "cors";
import verifyJwtToken from "./server/middleware/verifyJwtToken.js";
import globalErrorHandler from "./server/helper/globalErrorHandler.js";
import cartRoute from "./server/routes/cartRoute.js";
import refreshTokenRoute from "./server/routes/refreshTokenRoute.js";
import isPermitted from "./server/middleware/isPermitted.js";
import { USERS_AND_GUESTS } from "./server/helper/permission.js";
import addressRoute from "./server/routes/addressRoute.js";

import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

io.on("connection", (socket) => {
  console.log(socket.id);
});

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/users", usersRoute);
app.use("/refreshtoken", refreshTokenRoute);

app.use(verifyJwtToken);
app.use(isPermitted(USERS_AND_GUESTS));
app.use("/products", productsRoute);
app.use("/make", makeRoute);
app.use("/model", modelRoute);
app.use("/year", yearRoute);
app.use("/categories", categoriesRoute);
app.use("/cart", cartRoute);
app.use("/address", addressRoute);

app.get("/", (req, res) => {
  res.send("server is up");
  console.log("server is up");
});

// ==== error handler ====
app.use(globalErrorHandler);

httpServer.listen(port, () => console.log("server is up"));
//http://localhost:3000/
