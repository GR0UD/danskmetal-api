import { Schema, model } from "mongoose";

const sandwichSchema = new Schema({
  orders: {
    type: [Schema.Types.ObjectId],
    ref: "SandwichOrder",
  },
});

export const Sandwich = model("Sandwich", sandwichSchema);

const sandwichOrderSchema = new Schema({
  name: { type: String, required: true },
  bread: { type: String, required: true },
  sauce: { type: String, required: true },
  customer: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export const SandwichOrder = model("SandwichOrder", sandwichOrderSchema);
