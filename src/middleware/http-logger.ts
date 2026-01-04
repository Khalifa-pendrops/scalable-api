import pinoHttp from "pino-http";
import { logger } from "../infrastructure/logger";

export const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => req.id,
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
      };
    },
  },
});
