import { addDoc, collection, doc, getDoc, getDocs } from "../deps.ts";
import { db } from "../firestore.ts";

export type AddCommandArgs = {
  timestamp: string;
  groupName: string | undefined;
  targetMemberName: string | undefined;
};

export const add = async (
  { groupName, timestamp, targetMemberName }: AddCommandArgs,
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
  const rawMemberNames: string[] = [];
  const groupSnaps = await getDocs(
    collection(db, `groups/${groupName}/members`),
  );
  groupSnaps.forEach((doc) => {
    const tmp = doc.data();
    rawMemberNames.push(tmp.memberName);
    if (tmp.memberName === targetMemberName) {
      result.push(doc.id);
    }
  });

  if (result.length !== 0) {
    console.info(`[INFO] The specified member name is a duplicate.`);
    const memberNames = rawMemberNames.map((value, index) =>
      `${index + 1}. ${value}`
    ).join("\n~~~~~~~~~~~~~~~~~~~\n");

    return `【${groupName}】グループ内に"${targetMemberName}"の情報がすでに登録されています！詳しくは下記のリストを確認してください🔍
========================================================================
${memberNames}`;
  }

  const groupRef = doc(collection(db, "groups"), groupName);
  const membersRef = collection(groupRef, "members");
  await addDoc(membersRef, {
    memberName: targetMemberName,
    timestamp,
  });

  return `"${groupName}"グループに【${targetMemberName}】を追加しました！ Welcome.👏👏👏`;
};
