import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./src/routes/userRoutes.js";
import noteRoute from "./src/routes/noteroute.js";
import { dbConnect } from "./src/config/dbConfig.js";
import "./src/config/cloudinary.js"


dotenv.config();

const app = express();
const port = process.env.PORT || 8001;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/user", userRoute);
app.use("/note", noteRoute);

dbConnect();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


console.log("Server boot complete");
