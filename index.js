import express from "express";
import productsRoute from "./server/routes/productsRoute.js";
import makeRoute from "./server/routes/makeRoute.js";

const app = express();
const port = process.env.PORT || 3000;

app.use("/products", productsRoute);
app.use("/make", makeRoute);

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
