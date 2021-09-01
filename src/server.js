import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import blogRouter from "./blogs/index.js";

const port = process.env.PORT || 3001;
const mongoConnection = process.env.MONGO_CONNECTION_STRING;
const server = express();

server.use(cors());
server.use(express.json());
server.use("/blogs", blogRouter);

server.listen(port, async () => {
  try {
    mongoose.connect(mongoConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Server is running on port ${port} and is connected to db`);
  } catch (err) {
    console.log("Db connection is faild", err);
  }
});

server.on("error", (error) => console.log(`Server faild : ${error}`));
