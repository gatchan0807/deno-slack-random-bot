import { doc, getDoc, setDoc } from "../deps.ts";
import { db } from "../firestore.ts";

export type CreateCommandArgs = {
  groupName: string | undefined;
  timestamp: string;
};

export const create = async (
  { groupName, timestamp }: CreateCommandArgs,
): Promise<string> => {
  if (!groupName) {
    return `指定のグループ名が受け取れませんでした🤔`;
  }

  const docRef = doc(db, "groups", groupName);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.info(`[INFO] The specified group name already exists.`);
    return `ごめんなさい！【${groupName}】はすでに存在します。別のグループ名を設定してください🙇`;
  }

  await setDoc(doc(db, "groups", groupName), {
    created: timestamp,
    groupName,
  }, { merge: true });

  console.info("[INFO] Created Group Name: ", groupName);
  return `【 ${groupName} 】グループの作成が完了しました🎉`;
};
