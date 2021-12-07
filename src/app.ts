import "https://deno.land/x/dotenv@v2.0.0/load.ts";
import { App } from "https://deno.land/x/slack_bolt@1.0.0/mod.ts";

import { SubCommandPattern } from "./subcommands.ts";

const app = new App({
  token: Deno.env.get("SLACK_BOT_TOKEN"),
  signingSecret: Deno.env.get("SLACK_SIGNING_SECRET"),
});

// グループの入れ物の作成コマンド
app.message(SubCommandPattern.create, async ({ event, say }) => {
  const _anyEvent = event as any;
  const text = _anyEvent.text as string;
  const user = _anyEvent.user as string;
  const [_botName, _subcommand, groupName] = text.split(" ");

  console.log("[INFO] Create: ", _anyEvent.text);

  await say(`<@${user}> 【 ${groupName} 】グループの作成が完了しました🎉`);
});

// グループにユーザーを追加するコマンド
app.message(SubCommandPattern.add, async ({ event, say }) => {
  const _anyEvent = event as any;
  const text = _anyEvent.text as string;
  const user = _anyEvent.user as string;
  const [_botName, _subcommand, groupName, targetUserName] = text.split(" ");

  console.log("[INFO] Add: ", _anyEvent.text);
  await say(
    `<@${user}> "${groupName}"グループに【${targetUserName}】を追加しました！ Welcome.👏👏👏`,
  );
});

// グループからユーザーを削除するコマンド
app.message(SubCommandPattern.delete, async ({ event, say }) => {
  const _anyEvent = event as any;
  const text = _anyEvent.text as string;
  const user = _anyEvent.user as string;
  const [_botName, _subcommand, groupName, targetUserName] = text.split(" ");

  console.log("[INFO] Delete: ", _anyEvent.text);

  await say(
    `<@${user}> "${groupName}"グループから【${targetUserName}】を削除しました。 See you soon.👋`,
  );
});

// グループ内のユーザーリストをランダムに並び替えるコマンド
app.message(SubCommandPattern.randomSort, async ({ event, say }) => {
  const _anyEvent = event as any;
  const text = _anyEvent.text as string;
  const user = _anyEvent.user as string;
  const [_botName, _subcommand, groupName] = text.split(" ");

  const result = ["username1", "username2", "username3", "username4"].sort(() =>
    Math.random() - 0.5
  )
    .map((value, index) => `${index + 1}. ${value}`)
    .join(
      "\n~~~~~~~~~~~~~~~~~~~\n",
    );

  console.log("[INFO] Random sort: ", _anyEvent.text);
  await say(`<@${user}> ${groupName}グループのメンバーをランダムに並べ替えました！
  ========================================================================
${result}`);
});

// Event Subscriptionsの項でRequest URLの設定が一向にVerifyしないので一旦エラーを握りつぶす
app.error(async (error) => {
  console.error(error);
  return await void 0; // 型情報合わせのためのPromise<void>
});

await app.start({ port: 3001 });
console.log("🦕 ⚡️");
