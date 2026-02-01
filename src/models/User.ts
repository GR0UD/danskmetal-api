import { Schema, model } from "mongoose";
import crypto from "crypto";

const userSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: false },
});

export const User = model("User", userSchema);

export const signin = async (body: any) => {
  let password = Bun.password.hash(body.password);

  let user = await User.findOne({ password });

  if (!user) {
    return 404;
  }

  const token = crypto.randomBytes(24).toString("hex");

  user.token = token;
  await user.save();

  return { token, status: 200 };
};
