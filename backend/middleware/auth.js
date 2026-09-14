import { decode } from "@auth/core/jwt";
import { User } from "../models/User.js";

function sessionCookie(req) {
  const cookies = (req.headers.cookie || "").split(";");
  for (const name of ["authjs.session-token", "__Secure-authjs.session-token"]) {
    const found = cookies.map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(`${name}=`));
    if (found) return decodeURIComponent(found.slice(name.length + 1));
  }
  return null;
}

export async function requireAuth(req, res, next) {
  try {
    const token = sessionCookie(req);
    if (!token || !process.env.AUTH_SECRET) throw new Error("No session");
    const cookieName = cookiesName(req);
    const session = await decode({ token, secret: process.env.AUTH_SECRET, salt: cookieName });
    if (!session?.sub) throw new Error("No user");
    req.user = await User.findByIdAndUpdate(
      session.sub,
      { $set: { name: session.name, email: session.email, image: session.picture || session.image }, $setOnInsert: { _id: session.sub } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();
    return next();
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ error: "Unable to create account" });
    return res.status(401).json({ error: "Authentication required" });
  }
}

function cookiesName(req) {
  return req.headers.cookie?.includes("__Secure-authjs.session-token=")
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";
}
