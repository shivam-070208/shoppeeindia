import type { Job } from "bullmq";
import { JobName } from "@/jobs/types";
import type { EmailJobPayload } from "@/jobs/types";
import { processAdminElected } from "./admin-elected.processor";

const EMAIL_PROCESSORS: Partial<
  Record<JobName, (job: Job<EmailJobPayload>) => Promise<void>>
> = {
  [JobName.ADMIN_ELECTED]: processAdminElected,
};

export async function emailJobProcessor(
  job: Job<EmailJobPayload>,
): Promise<void> {
  const processor = EMAIL_PROCESSORS[job.name as JobName];

  if (!processor) {
    throw new Error(
      `[Email Worker] No processor registered for job name: "${job.name}"`,
    );
  }

  await processor(job);
}
