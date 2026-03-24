// ─── Job Names ────────────────────────────────────────────────────────────────
// Convention: "<queue>.<action>" — makes it easy to route in workers / dispatcher
export enum JobName {
  // Email jobs
  ADMIN_ELECTED = "email.admin_elected",
}

// ─── Payload Types ────────────────────────────────────────────────────────────
// Each job name maps to a strongly-typed payload interface.

export interface AdminElectedPayload {
  adminId: string;
  name: string;
  email: string;
}

// ↓ Add more payload interfaces here:
// export interface PasswordResetPayload { ... }

// ─── Payload Map ─────────────────────────────────────────────────────────────
// Maps every JobName → its payload type.
// TypeScript will error if you add a new JobName but forget to add its payload.
export type JobPayloadMap = {
  [JobName.ADMIN_ELECTED]: AdminElectedPayload;
  // [JobName.PASSWORD_RESET]: PasswordResetPayload;
};

// Convenience: union of all payloads for a given queue category
export type EmailJobPayload = JobPayloadMap[Extract<
  JobName,
  `email.${string}`
>];
