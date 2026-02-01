import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://localhost:27017/sandwichdb";

export function connectDB() {
  mongoose
    .connect(MONGODB_URI, {
      dbName: "sandwich",
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
      console.log("MongoDB connection failed:", err);
    });
}
