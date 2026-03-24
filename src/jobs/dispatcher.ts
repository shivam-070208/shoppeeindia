import type { JobsOptions } from "bullmq";
import { JobName, type JobPayloadMap } from "@/jobs/types";
import { getEmailQueue } from "@/jobs/queues";

type QueueGetter = ReturnType<typeof getEmailQueue>;
const QUEUE_ROUTING: Array<{ prefix: string; getQueue: () => QueueGetter }> = [
  { prefix: "email.", getQueue: getEmailQueue },
];

export async function dispatch<T extends keyof JobPayloadMap>(
  jobName: T,
  data: JobPayloadMap[T],
  options?: JobsOptions,
) {
  const entry = QUEUE_ROUTING.find((r) => jobName.startsWith(r.prefix));

  if (!entry) {
    throw new Error(
      `[Dispatcher] No queue registered for job name: "${String(jobName)}"`,
    );
  }

  const queue = entry.getQueue();
  return queue.add(jobName as string, data, options);
}
