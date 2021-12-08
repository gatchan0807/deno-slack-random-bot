import "dotenv/load.ts";
import { App } from "slack_bolt/mod.ts";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  query,
  setDoc,
  where,
} from "firebase/firestore";

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

  console.log("[INFO] Execute ping command:", _anyEvent.text);
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

  console.log(
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

  console.log("[INFO] Execute disband command:", _anyEvent.text);
  const groupsRef = collection(db, "groups");

  const q = query(
    groupsRef,
    where("groupName", "==", groupName),
  );

  const querySnapshot = await getDocs(q);

  const result: string[] = [];
  const disbandTarget: DocumentData = [];
  querySnapshot.forEach((doc) => {
    const groupDoc = doc.data();
    result.push(groupDoc.groupName);
    disbandTarget.push(groupDoc);
  });

  if (result.length === 0) {
    console.info(`[INFO] The specified group name does not found.`);
    await say(`<@${user}> 【${groupName}】グループは登録リストに見つかりませんでした！`);
    return;
  }

  await deleteDoc(disbandTarget[0]);
  console.log(
    "[INFO] Disband Group Id: ",
    disbandTarget[0].id,
    "/ Disband Group Name: ",
    groupName,
  );

  await say(`<@${user}> 【 ${groupName} 】グループを解散しました👣`);
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

await app.start({ port: 9000 });
console.log("🦕 ⚡️");
