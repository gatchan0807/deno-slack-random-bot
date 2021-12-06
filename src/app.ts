import "https://deno.land/x/dotenv@v2.0.0/load.ts";
import { App } from "https://deno.land/x/slack_bolt@1.0.0/mod.ts";

const app = new App({
  token: Deno.env.get("SLACK_BOT_TOKEN"),
  signingSecret: Deno.env.get("SLACK_SIGNING_SECRET"),
});

app.event("message", async ({ event, say }) => {
  console.log(event);
  await say("pong");
});

await app.start({ port: 3000 });
console.log("🦕 ⚡️");
