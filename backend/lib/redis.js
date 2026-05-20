import Redis from "ioredis";

// await client.set('foo', 'bar');
import dotenv from "dotenv";
dotenv.config();
export const redis = new Redis(process.env.REDIS_URL);
// export const redis = createClient({
//   url: process.env.REDIS_URL,
// });

// client.on("error", function (err) {
//   throw err;
// });
// await client.connect();
// await client.set("foo", "bar");

// // Disconnect after usage
// await client.disconnect();
