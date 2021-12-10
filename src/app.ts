import { App } from "./deps.ts";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs } from "./deps.ts";

import { helpMessage, SubCommandPattern } from "./subcommands.ts";
import { formatMessage } from "./slack-util.ts";
import { db } from "./firestore.ts";

import { create } from "./command/create.ts";
import { disband } from "./command/disband.ts";

const port = Deno.env.get("PORT") ?? "3000";
const app = new App({
  token: Deno.env.get("SLACK_BOT_TOKEN"),
  signingSecret: Deno.env.get("SLACK_SIGNING_SECRET"),
});

app.message(SubCommandPattern.ping, async ({ event, say }) => {
  const { rawText, user } = formatMessage(event);

  console.info("[INFO] Execute ping command:", rawText);

  await say(`<@${user}> Pong.🏓 / ${rawText}`);
});

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
  const [groupName, targetUserName] = command.args;

  console.info("[INFO] Execute add command:", rawText);
  const docRef = doc(db, "groups", groupName);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.info(`[INFO] The specified group name does not found.`);
    await say(`<@${user}> 【${groupName}】グループは登録リストに見つかりませんでした！`);
    return;
  }

  const result: string[] = [];
  const rawUserNames: string[] = [];
  const groupSnaps = await getDocs(collection(db, `groups/${groupName}/users`));
  groupSnaps.forEach((doc) => {
    const tmp = doc.data();
    rawUserNames.push(tmp.userName);
    if (tmp.userName === targetUserName) {
      result.push(doc.id);
    }
  });

  if (result.length !== 0) {
    console.info(`[INFO] The specified user name is a duplicate.`);

    const userNames = rawUserNames.map((value, index) =>
      `${index + 1}. ${value}`
    )
      .join(
        "\n~~~~~~~~~~~~~~~~~~~\n",
      );
    await say(
      `<@${user}> 【${groupName}】グループ内に"${targetUserName}"の情報がすでに登録されています！詳しくは下記のリストを確認してください🔍
========================================================================
${userNames}
`,
    );
    return;
  }

  const groupRef = doc(collection(db, "groups"), groupName);
  const usersRef = collection(groupRef, "users");
  await addDoc(usersRef, {
    userName: targetUserName,
    timestamp: timestamp,
  });

  await say(
    `<@${user}> "${groupName}"グループに【${targetUserName}】を追加しました！ Welcome.👏👏👏`,
  );
});

// グループからユーザーを削除するコマンド
app.message(SubCommandPattern.delete, async ({ event, say }) => {
  const { command, rawText, user } = formatMessage(event);
  const [groupName, targetUserName] = command.args;

  console.info("[INFO] Execute delete command:", rawText);
  const docRef = doc(db, "groups", groupName);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.info(`[INFO] The specified group name does not found.`);
    await say(`<@${user}> 【${groupName}】グループは登録リストに見つかりませんでした！`);
    return;
  }

  const result: string[] = [];
  const rawUserNames: string[] = [];
  const groupSnaps = await getDocs(collection(db, `groups/${groupName}/users`));
  groupSnaps.forEach((doc) => {
    const tmp = doc.data();
    rawUserNames.push(tmp.userName);
    if (tmp.userName === targetUserName) {
      result.push(doc.id);
    }
  });

  if (result.length === 0) {
    console.info(`[INFO] The specified user name does not found.`);

    const userNames = rawUserNames.map((value, index) =>
      `${index + 1}. ${value}`
    )
      .join(
        "\n~~~~~~~~~~~~~~~~~~~\n",
      );
    await say(
      `<@${user}> 【${groupName}】グループ内に"${targetUserName}"の情報は見つかりませんでした！下記のリストから指定してください🔍
========================================================================
${userNames}
`,
    );
    return;
  }

  await deleteDoc(doc(db, "groups", groupName, "users", result[0]));

  await say(
    `<@${user}> "${groupName}"グループから【${targetUserName}】を削除しました。 See you soon.👋`,
  );
});

// グループ内のユーザーリストを表示するコマンド
app.message(SubCommandPattern.list, async ({ event, say }) => {
  const { command, rawText, user } = formatMessage(event);
  const [groupName] = command.args;

  console.info("[INFO] Execute list command:", rawText);
  const docRef = doc(db, "groups", groupName);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.info(`[INFO] The specified group name does not found.`);
    await say(`<@${user}> 【${groupName}】グループは登録リストに見つかりませんでした！`);
    return;
  }

  const raw: string[] = [];
  const groupSnaps = await getDocs(collection(db, `groups/${groupName}/users`));
  groupSnaps.forEach((doc) => {
    const tmp = doc.data();
    raw.push(tmp.userName);
  });

  const result = raw.map((value, index) => `${index + 1}. ${value}`)
    .join(
      "\n~~~~~~~~~~~~~~~~~~~\n",
    );

  await say(
    `<@${user}> 現在登録されている"${groupName}"グループのユーザーリストです！
  ========================================================================
${result}`,
  );
});

// グループ内のユーザーリストをランダムに並び替えるコマンド
app.message(SubCommandPattern.randomSort, async ({ event, say }) => {
  const { command, rawText, user } = formatMessage(event);
  const [groupName] = command.args;

  console.info("[INFO] Execute random sort command:", rawText);
  const docRef = doc(db, "groups", groupName);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.info(`[INFO] The specified group name does not found.`);
    await say(`<@${user}> 【${groupName}】グループは登録リストに見つかりませんでした！`);
    return;
  }

  const raw: string[] = [];
  const groupSnaps = await getDocs(collection(db, `groups/${groupName}/users`));
  groupSnaps.forEach((doc) => {
    const tmp = doc.data();
    raw.push(tmp.userName);
  });

  const result = raw.sort(() => Math.random() - 0.5).map((value, index) =>
    `${index + 1}. ${value}`
  )
    .join(
      "\n~~~~~~~~~~~~~~~~~~~\n",
    );

  await say(`<@${user}> "${groupName}"グループのメンバーをランダムに並べ替えました！🎲
  ========================================================================
${result}`);
});

// Event Subscriptionsの項でRequest URLの設定が一向にVerifyしないので一旦エラーを握りつぶす
app.error(async (error) => {
  console.error(error);
  return await void 0; // 型情報合わせのためのPromise<void>
});

await app.start({ port: parseInt(port) });
console.info(`🦕 ⚡️ on ${parseInt(port)}`);
