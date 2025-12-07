import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import vendorRoutes from "./routes/vendorRoutes.js";
import rfpRoutes from "./routes/rfpRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/v1", vendorRoutes);
app.use("/api/v1", rfpRoutes);
app.use("/api/v1", templateRoutes);
app.use("/api/v1", dashboardRoutes);

export default app;
