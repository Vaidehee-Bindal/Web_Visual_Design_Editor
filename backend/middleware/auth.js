import { decode } from "@auth/core/jwt";
import { User } from "../models/User.js";

function getSessionCookie(req) {
  const rawCookie = req.headers.cookie || "";

  const cookies = rawCookie
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);

  const cookieNames = [
    "__Secure-authjs.session-token",
    "authjs.session-token",
  ];

  for (const baseName of cookieNames) {
    const chunks = cookies
      .map((cookie) => {
        const separator = cookie.indexOf("=");
        if (separator === -1) return null;

        return {
          name: cookie.slice(0, separator),
          value: cookie.slice(separator + 1),
        };
      })
      .filter(Boolean)
      .filter(
        (cookie) =>
          cookie.name === baseName ||
          cookie.name.startsWith(`${baseName}.`),
      )
      .sort((a, b) => {
        const getIndex = (name) => {
          if (name === baseName) return 0;

          const suffix = name.slice(baseName.length + 1);
          const index = Number(suffix);

          return Number.isFinite(index) ? index + 1 : 999999;
        };

        return getIndex(a.name) - getIndex(b.name);
      });

    if (chunks.length) {
      return {
        token: chunks.map((chunk) => decodeURIComponent(chunk.value)).join(""),
        cookieName: baseName,
      };
    }
  }

  return null;
}

export async function requireAuth(req, res, next) {
  try {
    const sessionCookie = getSessionCookie(req);

    const secret =
      process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

    if (!sessionCookie) {
      console.log("AUTH: No Auth.js session cookie");
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    if (!secret) {
      console.error("AUTH: AUTH_SECRET is missing");
      return res.status(500).json({
        error: "Authentication configuration error",
      });
    }

    console.log(
      "AUTH: Session cookie received:",
      sessionCookie.cookieName,
    );

    const session = await decode({
      token: sessionCookie.token,
      secret,
      salt: sessionCookie.cookieName,
    });

    if (!session?.sub) {
      console.log("AUTH: Cookie decoded but no user id");
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    req.user = await User.findByIdAndUpdate(
      session.sub,
      {
        $set: {
          name: session.name,
          email: session.email,
          image: session.picture || session.image,
        },
        $setOnInsert: {
          _id: session.sub,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    ).lean();

    return next();
  } catch (error) {
    console.error("AUTH ERROR:", error);

    if (error?.code === 11000) {
      return res.status(409).json({
        error: "Unable to create account",
      });
    }

    return res.status(401).json({
      error: "Authentication required",
    });
  }
}