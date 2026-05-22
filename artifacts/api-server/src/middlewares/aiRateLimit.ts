import rateLimit from "express-rate-limit";

export const aiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req: any) => req.userId ?? req.ip ?? "anonymous",
  message: {
    error: "Too many AI requests. Please wait a moment before trying again.",
  },
  skip: () => process.env.NODE_ENV === "test",
});

export const photoRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req: any) => req.userId ?? req.ip ?? "anonymous",
  message: {
    error: "Too many photo scans. Please wait a moment before trying again.",
  },
  skip: () => process.env.NODE_ENV === "test",
});
