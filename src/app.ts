import { App } from "./deps.ts";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "./deps.ts";

import { helpMessage, SubCommandPattern } from "./subcommands.ts";
import { db } from "./firestore.ts";

const port = Deno.env.get("PORT") ?? "3000";
const app = new App({
  token: Deno.env.get("SLACK_BOT_TOKEN"),
  signingSecret: Deno.env.get("SLACK_SIGNING_SECRET"),
});

console.log(
  Deno.env.get("SLACK_BOT_TOKEN"),
  Deno.env.get("SLACK_SIGNING_SECRET"),
  typeof Deno.env.get("SLACK_BOT_TOKEN"),
  typeof Deno.env.get("SLACK_SIGNING_SECRET"),
);

app.message(SubCommandPattern.ping, async ({ event, say }) => {
  const _anyEvent = event as any;
  const text = _anyEvent.text as string;
  const user = _anyEvent.user as string;
  const [_botName, _subcommand] = text.split(" ");

  console.info("[INFO] Execute ping command:", _anyEvent.text);
  await say(`<@${user}> Pong.🏓 / ${text}`);
});

app.message(SubCommandPattern.help, async ({ event, say }) => {
  const _anyEvent = event as any;
  const text = _anyEvent.text as string;
  const user = _anyEvent.user as string;
  const [_botName, _subcommand] = text.split(" ");

  console.info("[INFO] Execute ping command:", _anyEvent.text);
  await say(`<@${user}> ${helpMessage}`);
});

// グループの入れ物の作成コマンド
app.message(SubCommandPattern.create, async ({ event, say }) => {
  const _anyEvent = event as any;
  const text = _anyEvent.text as string;
  const user = _anyEvent.user as string;
  const timestamp = _anyEvent.ts as string;
  const [_botName, _subcommand, groupName] = text.split(" ");

  console.info("[INFO] Execute create command:", _anyEvent.text);

  const docRef = doc(db, "groups", groupName);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.info(`[INFO] The specified group name already exists.`);
    await say(`<@${user}> ごめんなさい！【${groupName}】はすでに存在します。別のグループ名を設定してください🙇`);
    return;
  }

  await setDoc(doc(db, "groups", groupName), {
    created: timestamp,
    groupName,
  }, { merge: true });

  console.info(
    "[INFO] Created Group Name: ",
    groupName,
  );

  await say(`<@${user}> 【 ${groupName} 】グループの作成が完了しました🎉`);
});

// グループの入れ物の削除コマンド
app.message(SubCommandPattern.disband, async ({ event, say }) => {
  const _anyEvent = event as any;
  const text = _anyEvent.text as string;
  const user = _anyEvent.user as string;
  const [_botName, _subcommand, groupName] = text.split(" ");

  console.info("[INFO] Execute disband command:", _anyEvent.text);
  const docRef = doc(db, "groups", groupName);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.info(`[INFO] The specified group name does not found.`);
    await say(`<@${user}> 【${groupName}】グループは登録リストに見つかりませんでした！`);
    return;
  }

  await deleteDoc(docRef);
  console.info(
    "[INFO] Disband Group Name: ",
    docSnap.id,
  );

  await say(`<@${user}> 【 ${groupName} 】グループを解散しました👣`);
});

// グループにユーザーを追加するコマンド
app.message(SubCommandPattern.add, async ({ event, say }) => {
  const _anyEvent = event as any;
  const text = _anyEvent.text as string;
  const user = _anyEvent.user as string;
  const timestamp = _anyEvent.ts as string;
  const [_botName, _subcommand, groupName, targetUserName] = text.split(" ");

  console.info("[INFO] Execute add command:", _anyEvent.text);
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
  const _anyEvent = event as any;
  const text = _anyEvent.text as string;
  const user = _anyEvent.user as string;
  const [_botName, _subcommand, groupName, targetUserName] = text.split(" ");

  console.info("[INFO] Execute delete command:", _anyEvent.text);
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
  const _anyEvent = event as any;
  const text = _anyEvent.text as string;
  const user = _anyEvent.user as string;
  const [_botName, _subcommand, groupName] = text.split(" ");

  console.info("[INFO] Execute list command:", _anyEvent.text);
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
  const _anyEvent = event as any;
  const text = _anyEvent.text as string;
  const user = _anyEvent.user as string;
  const [_botName, _subcommand, groupName] = text.split(" ");

  console.info("[INFO] Execute random sort command:", _anyEvent.text);
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
