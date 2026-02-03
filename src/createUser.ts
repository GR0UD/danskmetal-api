import { connectDB } from "./db.js";
import { User } from "./models/User.js";

// Internal only - not exported to prevent unauthorized user creation
const createUserDocument = async (body: any) => {
  let copy = body;

  copy.password = await Bun.password.hash(body.password);

  return await User.create(copy);
};

async function createUser() {
  await connectDB();

  // NOTE: Always only create a token on signin, not signup (creation), and always create a new token per sign in
  const doc = {
    name: "admin",
    password: "YouThought :)", // 4-digit PIN
  };

  const created = await createUserDocument(doc);
  console.log("Created user:", created);
  process.exit(0);
}

createUser().catch((err) => {
  console.error(err);
  process.exit(1);
});
