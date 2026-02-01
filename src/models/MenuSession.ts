import { Schema, model } from "mongoose";
import crypto from "crypto";

// In seconds - 4 hours TTL
const TTL = 60 * 60 * 4;

const menuSessionSchema = new Schema({
  // Unique short code for the session URL (e.g., HrJfeQx)
  code: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomBytes(4).toString("base64url").slice(0, 7),
  },
  // Reference to the admin user who created this session
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Status of the session
  status: {
    type: String,
    enum: ["active", "closed"],
    default: "active",
  },
  // Orders in this session
  orders: [
    {
      sandwich: { type: String, required: true },
      bread: { type: String },
      dressing: { type: String },
      customer: { type: String },
      image: { type: String },
      url: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
    index: { expireAfterSeconds: Math.floor(TTL) },
  },
});

// Generate a new unique code if collision occurs
menuSessionSchema.pre("save", async function (next) {
  if (this.isNew) {
    let attempts = 0;
    while (attempts < 5) {
      const existing = await MenuSession.findOne({ code: this.code });
      if (!existing) break;
      this.code = crypto.randomBytes(4).toString("base64url").slice(0, 7);
      attempts++;
    }
  }
  next();
});

export const MenuSession = model("MenuSession", menuSessionSchema);
