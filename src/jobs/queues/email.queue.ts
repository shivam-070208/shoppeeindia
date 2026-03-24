import { Queue } from "bullmq";
import { getRedisConnectionOptions } from "@/jobs/lib/connection";
import type { EmailJobPayload } from "@/jobs/types";

export const EMAIL_QUEUE_NAME = "shoppeeindia_email";

let _emailQueue: Queue<EmailJobPayload> | null = null;

export function getEmailQueue(): Queue<EmailJobPayload> {
  if (!_emailQueue) {
    _emailQueue = new Queue<EmailJobPayload>(EMAIL_QUEUE_NAME, {
      connection: getRedisConnectionOptions(),
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2_000,
        },
        removeOnComplete: { count: 200 },
        removeOnFail: { count: 100 },
      },
    });
  }

  return _emailQueue;
}
