import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { UserModel } from "../auth/auth.model";
import { performance } from "perf_hooks";

const router = Router();

// 1) Baseline endpoint: measures Express + middleware overhead
router.get("/ping", (_req, res) => {
  res.status(200).json({ ok: true });
});

// 2) Protected endpoint: measures JWT verification overhead
router.get("/protected", requireAuth, (req, res) => {
  res.status(200).json({ ok: true, userId: req.user!.id });
});

// 3) DB read endpoint: measures Mongo read performance
router.get("/db-read", requireAuth, async (req, res, next) => {
  try {
    const start = performance.now();

    const user = await UserModel.findById(req.user!.id).select("_id roles");

    const ms = performance.now() - start;

    return res.status(200).json({ ok: true, ms, user });
  } catch (e) {
    next(e);
  }
});

router.get("/whoami", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
