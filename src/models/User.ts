import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: false },
});

export const User = model("User", userSchema);
