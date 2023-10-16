import express from "express";
import productsRoute from "./server/routes/productsRoute.js";
import makeRoute from "./server/routes/makeRoute.js";
import modelRoute from "./server/routes/modelRoute.js";
import yearRoute from "./server/routes/yearRoute.js";
import categoriesRoute from "./server/routes/categoriesRoute.js";
import usersRoute from "./server/routes/usersRoute.js";
import cors from "cors";
import globalErrorHandler from "./server/helper/globalErrorHandler.js";
import cartRoute from "./server/routes/cartRoute.js";
import refreshTokenRoute from "./server/routes/refreshTokenRoute.js";
import addressRoute from "./server/routes/addressRoute.js";
import ordersRoute from "./server/routes/ordersRoute.js";
import { createServer } from "http";
import { Server } from "socket.io";
import socketVerifyJwtToken from "./server/middleware/socketVerifyJwtToken.js";
import socketIsPermitted from "./server/middleware/socketIsPermitted.js";
import employeeRoute from "./server/routes/employeeRoute.js";
import cookieParser from "cookie-parser";
import dashBoardRoute from "./server/routes/dashBoardRoute.js";
import favoritesRoute from "./server/routes/favoritesRoute.js";
import notificationRoute from "./server/routes/notificationRoute.js";
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
  cors: {
    credentials: true,
    origin: [
      "http://localhost:5173",
      "https://auto-parts-dashboard.onrender.com",
    ],
  },
});

io.use(socketVerifyJwtToken);

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("OrderSent", (userId) => {
    socket.broadcast.emit("OrderUpdate", { userId: userId });
    socket.broadcast.emit("OrderSent", "newOrder");
  });

  socket.on("refresh", () => {
    socket.broadcast.emit("refresh", "all");
  });

  socket.on("OrderUpdate", (userObj) => {
    //userObj contains userId
    socket.broadcast.emit("OrderUpdate", userObj);
  });
});

const port = process.env.PORT || 3000;

const corsConfig = {
  credentials: true,
  origin: ["http://localhost:5173", "https://tqpq2cws-5173.use2.devtunnels.ms"],
};
app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());

app.use("/dashboard", dashBoardRoute);

app.use("/users", usersRoute);
app.use("/refreshtoken", refreshTokenRoute);
app.use("/employee", employeeRoute);
app.use("/orders", ordersRoute);

app.use("/products", productsRoute);
app.use("/make", makeRoute);
app.use("/model", modelRoute);
app.use("/year", yearRoute);
app.use("/categories", categoriesRoute);
app.use("/cart", cartRoute);
app.use("/address", addressRoute);
app.use("/favorites", favoritesRoute);
app.use("/notifications", notificationRoute);

app.get("/", (req, res) => {
  res.send("server is up");
  console.log("server is up");
});

// ==== error handler ====
app.use(globalErrorHandler);

httpServer.listen(port, () => console.log("server is up"));
//http://localhost:3000/
