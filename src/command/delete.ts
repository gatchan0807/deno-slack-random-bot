import { collection, deleteDoc, doc, getDoc, getDocs } from "../deps.ts";
import { db } from "../firestore.ts";

export type DeleteCommandArgs = {
  groupName: string | undefined;
  targetMemberName: string | undefined;
};

export const deleteCommand = async (
  { groupName, targetMemberName }: DeleteCommandArgs,
): Promise<string> => {
  if (!groupName) {
    return `指定のグループ名が受け取れませんでした🤔`;
  }
  if (!targetMemberName) {
    return `指定のメンバー名が受け取れませんでした🤔`;
  }

  const docRef = doc(db, "groups", groupName);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.info(`[INFO] The specified group name does not found.`);
    return `【${groupName}】グループは登録リストに見つかりませんでした！`;
  }

  const result: string[] = [];
  const rawUserNames: string[] = [];
  const groupSnaps = await getDocs(collection(db, `groups/${groupName}/users`));
  groupSnaps.forEach((doc) => {
    const tmp = doc.data();
    rawUserNames.push(tmp.userName);
    if (tmp.userName === targetMemberName) {
      result.push(doc.id);
    }
  });

  if (result.length === 0) {
    console.info(`[INFO] The specified user name does not found.`);
    const userNames = rawUserNames.map((value, index) =>
      `${index + 1}. ${value}`
    ).join("\n~~~~~~~~~~~~~~~~~~~\n");

    return `【${groupName}】グループ内に"${targetMemberName}"の情報は見つかりませんでした！下記のリストから指定してください🔍
========================================================================
${userNames}
     `;
  }

  await deleteDoc(doc(db, "groups", groupName, "users", result[0]));

  return `"${groupName}"グループから【${targetMemberName}】を削除しました。 See you soon.👋`;
};
