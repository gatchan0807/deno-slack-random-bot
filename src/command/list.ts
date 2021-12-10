import { collection, doc, getDoc, getDocs } from "../deps.ts";
import { db } from "../firestore.ts";

export type ListCommandArgs = {
  groupName: string | undefined;
};

export const list = async (
  { groupName }: ListCommandArgs,
): Promise<string> => {
  if (!groupName) {
    return `指定のグループ名が受け取れませんでした🤔`;
  }

  const docRef = doc(db, "groups", groupName);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.info(`[INFO] The specified group name does not found.`);
    return `【${groupName}】グループは登録リストに見つかりませんでした！`;
  }

  const raw: string[] = [];
  const groupSnaps = await getDocs(
    collection(db, `groups/${groupName}/members`),
  );
  groupSnaps.forEach((doc) => {
    const tmp = doc.data();
    raw.push(tmp.memberName);
  });

  const result = raw.map((value, index) => `${index + 1}. ${value}`)
    .join(
      "\n~~~~~~~~~~~~~~~~~~~\n",
    );
  return `現在登録されている"${groupName}"グループのユーザーリストです！
========================================================================
${result}`;
};
