import IORedis from "ioredis";

// Singleton — BullMQ requires the same connection instance to be reused
// across queues and workers within the same process.
let _connection: IORedis | null = null;

export function getRedisConnection(): IORedis {
  if (!_connection) {
    const url = process.env.REDIS_URL;
    if (!url) {
      throw new Error("REDIS_URL environment variable is not set.");
    }

    _connection = new IORedis(url, {
      // Required by BullMQ — disables ioredis' built-in retry backoff so
      // BullMQ can manage retries itself.
      maxRetriesPerRequest: null,
    });

    _connection.on("error", (err) => {
      console.error("[Redis] Connection error:", err.message);
    });

    _connection.on("connect", () => {
      console.log("[Redis] Connected.");
    });
  }

  return _connection;
}

export function getRedisConnectionOptions() {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error("REDIS_URL environment variable is not set.");
  }

  return {
    host: (() => {
      try {
        const u = new URL(url);
        return u.hostname;
      } catch {
        return undefined;
      }
    })(),
    port: (() => {
      try {
        const u = new URL(url);
        return Number(u.port) || 6379;
      } catch {
        return 6379;
      }
    })(),
    username: (() => {
      try {
        const u = new URL(url);
        return u.username || undefined;
      } catch {
        return undefined;
      }
    })(),
    password: (() => {
      try {
        const u = new URL(url);
        return u.password || undefined;
      } catch {
        return undefined;
      }
    })(),
    maxRetriesPerRequest: null,
    tls: (() => {
      try {
        const u = new URL(url);
        return u.protocol === "rediss:" ? {} : undefined;
      } catch {
        return undefined;
      }
    })(),
  };
}
