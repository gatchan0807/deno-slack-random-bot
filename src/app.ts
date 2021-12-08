import "dotenv/load.ts";
import { App } from "slack_bolt/mod.ts";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

import { SubCommandPattern } from "./subcommands.ts";
import { db } from "./firestore.ts";

const app = new App({
  token: Deno.env.get("SLACK_BOT_TOKEN"),
  signingSecret: Deno.env.get("SLACK_SIGNING_SECRET"),
});

app.message(SubCommandPattern.ping, async ({ event, say }) => {
  const _anyEvent = event as any;
  const text = _anyEvent.text as string;
  const user = _anyEvent.user as string;
  const [_botName, _subcommand] = text.split(" ");

  await say(`<@${user}> Pong.🏓 / ${text}`);
});

// グループの入れ物の作成コマンド
app.message(SubCommandPattern.create, async ({ event, say }) => {
  const _anyEvent = event as any;
  const text = _anyEvent.text as string;
  const user = _anyEvent.user as string;
  const timestamp = _anyEvent.ts as string;
  const [_botName, _subcommand, groupName] = text.split(" ");

  console.log("[INFO] Execute create command:", _anyEvent.text);
  const groupsRef = collection(db, "groups");

  const q = query(
    collection(db, "groups"),
    where("groupName", "==", groupName),
  );

  const querySnapshot = await getDocs(q);

  const result: string[] = [];
  querySnapshot.forEach((doc) => {
    const groupDoc = doc.data();
    result.push(groupDoc.groupName);
  });

  if (result.length !== 0) {
    console.info(`[INFO] The specified already exists group name.`);
    await say(`<@${user}> ごめんなさい！【${groupName}】はすでに存在します。別のグループ名を設定してください🙇`);
    return;
  }

  const docRef = await addDoc(groupsRef, {
    created: timestamp,
    groupName,
  });
  console.log(
    "[INFO] Created Group Id: ",
    docRef.id,
    "/ Created Group Name: ",
    groupName,
  );

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

await app.start({ port: 3002 });
console.log("🦕 ⚡️");
