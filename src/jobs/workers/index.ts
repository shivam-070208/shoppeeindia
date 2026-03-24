// ─── Worker Registry ──────────────────────────────────────────────────────────
// Call startAllWorkers() from the worker entry point (src/worker.ts) to spin up
// every registered worker in a single process.
// To add a new worker: create it in this folder and call it below.

import { createEmailWorker } from "./email.worker";

export function startAllWorkers(): void {
  createEmailWorker();

  // ↓ Register new workers here:
  // createNotificationWorker();
  // createReportWorker();
}
