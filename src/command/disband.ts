import { deleteDoc, doc, getDoc } from "../deps.ts";
import { db } from "../firestore.ts";

export type DisbandCommandArgs = {
  groupName: string | undefined;
};

export const disband = async (
  { groupName }: DisbandCommandArgs,
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

  await deleteDoc(docRef);
  console.info("[INFO] Disband Group Name: ", docSnap.id);

  return `【 ${groupName} 】グループを解散しました👣`;
};
