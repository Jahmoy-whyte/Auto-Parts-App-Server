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
import { USERS_AND_GUESTS, USER_ONLY } from "./server/helper/permission.js";
import addressRoute from "./server/routes/addressRoute.js";
import ordersRoute from "./server/routes/ordersRoute.js";
import { createServer } from "http";
import { Server } from "socket.io";
import socketVerifyJwtToken from "./server/middleware/socketVerifyJwtToken.js";
import socketIsPermitted from "./server/middleware/socketIsPermitted.js";
import employeeRoute from "./server/routes/employeeRoute.js";
import cookieParser from "cookie-parser";
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

io.use(socketVerifyJwtToken);
io.use(socketIsPermitted(USER_ONLY));

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("hello", (arg) => {
    // console.log(socket.handshake.auth.token);
    console.log(arg);
  });
});

const port = process.env.PORT || 3000;

const corsConfig = {
  credentials: true,
  origin: "http://localhost:5173",
};
app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());

app.use("/users", usersRoute);
app.use("/refreshtoken", refreshTokenRoute);
app.use("/employee", employeeRoute);
app.use("/orders", ordersRoute);
//app.use(verifyJwtToken);
//app.use(isPermitted(USERS_AND_GUESTS));

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
