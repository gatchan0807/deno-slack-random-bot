import { App } from "./deps.ts";

import { helpMessage, SubCommandPattern } from "./subcommands.ts";
import { formatMessage } from "./utils.ts";

import { create } from "./command/create.ts";
import { disband } from "./command/disband.ts";
import { add } from "./command/add.ts";
import { deleteCommand } from "./command/delete.ts";
import { list } from "./command/list.ts";
import { randomSort } from "./command/random-sort.ts";

const port = Deno.env.get("PORT") ?? "3000";
const app = new App({
  token: Deno.env.get("SLACK_BOT_TOKEN"),
  signingSecret: Deno.env.get("SLACK_SIGNING_SECRET"),
});

// 動作確認コマンド
app.message(SubCommandPattern.ping, async ({ event, say }) => {
  const { rawText, user } = formatMessage(event);

  console.info("[INFO] Execute ping command:", rawText);

  await say(`<@${user}> Pong.🏓 / ${rawText}`);
});

// ヘルプ表示コマンド
app.message(SubCommandPattern.help, async ({ event, say }) => {
  const { rawText, user } = formatMessage(event);

  console.info("[INFO] Execute ping command:", rawText);

  await say(`<@${user}> ${helpMessage}`);
});

// グループの入れ物の作成コマンド
app.message(SubCommandPattern.create, async ({ event, say }) => {
  const { command, forceTypedEvent, rawText, user } = formatMessage(event);
  const timestamp = forceTypedEvent.ts;
  const [groupName] = command.args;

  console.info("[INFO] Execute create command:", rawText);
  const resultMessage = await create({ timestamp, groupName });

  await say(`<@${user}> ${resultMessage}`);
});

// グループの入れ物の削除コマンド
app.message(SubCommandPattern.disband, async ({ event, say }) => {
  const { command, rawText, user } = formatMessage(event);
  const [groupName] = command.args;

  console.info("[INFO] Execute disband command:", rawText);
  const resultMessage = await disband({ groupName });

  await say(`<@${user}> ${resultMessage}`);
});

// グループにユーザーを追加するコマンド
app.message(SubCommandPattern.add, async ({ event, say }) => {
  const { command, forceTypedEvent, rawText, user } = formatMessage(event);
  const timestamp = forceTypedEvent.ts;
  const [groupName, targetMemberName] = command.args;

  console.info("[INFO] Execute add command:", rawText);
  const resultMessage = add({ timestamp, groupName, targetMemberName });

  await say(`<@${user}> ${resultMessage}`);
});

// グループからユーザーを削除するコマンド
app.message(SubCommandPattern.delete, async ({ event, say }) => {
  const { command, rawText, user } = formatMessage(event);
  const [groupName, targetMemberName] = command.args;

  console.info("[INFO] Execute delete command:", rawText);
  const resultMessage = deleteCommand({ groupName, targetMemberName });

  await say(`<@${user}> ${resultMessage}`);
});

// グループ内のユーザーリストを表示するコマンド
app.message(SubCommandPattern.list, async ({ event, say }) => {
  const { command, rawText, user } = formatMessage(event);
  const [groupName] = command.args;

  console.info("[INFO] Execute list command:", rawText);
  const resultMessage = list({ groupName });

  await say(`<@${user}> ${resultMessage}`);
});

// グループ内のユーザーリストをランダムに並び替えるコマンド
app.message(SubCommandPattern.randomSort, async ({ event, say }) => {
  const { command, rawText, user } = formatMessage(event);
  const [groupName] = command.args;

  console.info("[INFO] Execute random sort command:", rawText);
  const resultMessage = randomSort({ groupName });

  await say(`<@${user}> ${resultMessage}`);
});

// Event Subscriptionsの項でRequest URLの設定が一向にVerifyしないので一旦エラーを握りつぶす
app.error(async (error) => {
  console.error(error);
  return await void 0; // 型情報合わせのためのPromise<void>
});

await app.start({ port: parseInt(port) });
console.info(`🦕 ⚡️ on ${parseInt(port)}`);
