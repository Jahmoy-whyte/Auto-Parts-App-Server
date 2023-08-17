import express from "express";
import productsRoute from "./server/routes/productsRoute.js";
import makeRoute from "./server/routes/makeRoute.js";
import modelRoute from "./server/routes/modelRoute.js";
import yearRoute from "./server/routes/yearRoute.js";
import categoriesRoute from "./server/routes/categoriesRoute.js";
import usersRoute from "./server/routes/usersRoute.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/products", productsRoute);
app.use("/make", makeRoute);
app.use("/model", modelRoute);
app.use("/year", yearRoute);
app.use("/categories", categoriesRoute);
app.use("/users", usersRoute);

app.get("/", (req, res) => {
  res.send("server is up");
  console.log("server is up");
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({ message: error, status: "nok" });
});

app.listen(port, () => console.log("server is up"));
//http://localhost:3000/
