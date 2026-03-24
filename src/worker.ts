/**
 * Worker entry point — run separately from the Next.js dev server:
 *   npm run worker:dev   (watch mode for development)
 *   npm run worker       (production)
 *
 * This process connects to Redis and starts all BullMQ workers.
 * It is completely independent of the Next.js server; both can run in parallel.
 */
import "dotenv/config";
import { startAllWorkers } from "@/jobs/workers";

console.log("[Worker] Starting workers...");
startAllWorkers();
console.log("[Worker] All workers running. Waiting for jobs...");

// ─── Graceful shutdown ────────────────────────────────────────────────────────
// Allow in-flight jobs to finish before exiting.
async function shutdown(signal: string) {
  console.log(`[Worker] Received ${signal}. Shutting down gracefully...`);
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
