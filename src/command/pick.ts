import { collection, doc, getDoc, getDocs } from "../deps.ts";
import { db } from "../firestore.ts";
import { shuffle } from "../utils.ts";

export type PickCommandArgs = {
  groupName: string | undefined;
  pickCount: string | undefined;
};

export const pick = async (
  { groupName, pickCount }: PickCommandArgs,
): Promise<string> => {
  if (!groupName) {
    return `指定のグループ名が受け取れませんでした🤔`;
  }
  if (!pickCount) {
    return `指定のピックアップ人数が受け取れませんでした🤔`;
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

  const count = isNaN(parseInt(pickCount)) ? parseInt(pickCount) : 1;

  const result = shuffle(raw).slice(0, count).map((value, index) =>
    `${index + 1}. ${value}`
  )
    .join(
      "\n~~~~~~~~~~~~~~~~~~~\n",
    );

  return `"${groupName}"グループのメンバーから"${count}"人ランダムにピックアップしました🎯
========================================================================
${result}`;
};
