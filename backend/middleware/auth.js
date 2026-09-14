import { decode } from "@auth/core/jwt";
import { User } from "../models/User.js";

function sessionCookie(req) {
  const cookies = (req.headers.cookie || "")
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean);
  for (const name of ["authjs.session-token", "__Secure-authjs.session-token"]) {
    const chunks = cookies
      .map((cookie) => cookie.split("=", 2))
      .filter(([cookieName]) => cookieName === name || cookieName.startsWith(`${name}.`))
      .sort(([left], [right]) => {
        const leftIndex = left === name ? 0 : Number(left.slice(name.length + 1));
        const rightIndex = right === name ? 0 : Number(right.slice(name.length + 1));
        return leftIndex - rightIndex;
      })
      .map(([, value]) => value);
    if (chunks.length) return decodeURIComponent(chunks.join(""));
  }
  return null;
}

export async function requireAuth(req, res, next) {
  try {
    const token = sessionCookie(req);
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
    if (!token || !secret) throw new Error("No session");
    const cookieName = cookiesName(req);
    const session = await decode({ token, secret, salt: cookieName });
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
  return /(?:^|;\s*)__Secure-authjs\.session-token(?:\.\d+)?=/.test(req.headers.cookie || "")
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";
}
