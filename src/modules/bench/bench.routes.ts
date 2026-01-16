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
import mongoose from "mongoose";

router.get("/db-read", requireAuth, async (req, res, next) => {
  try {
    const t0 = performance.now();

    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ ok: false, message: "Unauthorized" });

    const t1 = performance.now();

    const user = await UserModel.findById(userId)
      .select("_id roles")
      .lean()
      .exec();

    const t2 = performance.now();

    // optional pool signals (may be undefined depending on driver version)
    // @ts-ignore
    const pool = mongoose.connection?.client?.topology?.s?.pool;

    return res.status(200).json({
      ok: true,
      msTotal: t2 - t0,
      msDb: t2 - t1,
      user,
      poolSize: pool?.size,
      poolWaitQueueSize: pool?.waitQueueSize,
    });
  } catch (e) {
    next(e);
  }
});

router.get("/whoami", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
