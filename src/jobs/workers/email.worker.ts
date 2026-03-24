import { Worker } from "bullmq";
import { EMAIL_QUEUE_NAME } from "@/jobs/queues/email.queue";
import { emailJobProcessor } from "@/jobs/processors/email";
import { getRedisConnectionOptions } from "@/jobs/lib/connection";

export function createEmailWorker(): Worker {
  const worker = new Worker(EMAIL_QUEUE_NAME, emailJobProcessor, {
    connection: getRedisConnectionOptions(),
    concurrency: 5,
  });

  worker.on("completed", (job) => {
    console.log(
      `[Email Worker] ✓ Job completed | id=${job.id} name=${job.name}`,
    );
  });

  worker.on("failed", (job, err) => {
    console.error(
      `[Email Worker] ✗ Job failed | id=${job?.id} name=${job?.name} attempt=${job?.attemptsMade}`,
      err?.message,
    );
  });

  worker.on("error", (err) => {
    console.error("[Email Worker] Worker error:", err);
  });

  console.log(
    `[Email Worker] Started — queue: "${EMAIL_QUEUE_NAME}", concurrency: 5`,
  );

  return worker;
}
