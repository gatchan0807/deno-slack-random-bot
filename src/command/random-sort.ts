import { collection, doc, getDoc, getDocs } from "../deps.ts";
import { db } from "../firestore.ts";

export type RandomSortCommandArgs = {
  groupName: string | undefined;
};

export const randomSort = async (
  { groupName }: RandomSortCommandArgs,
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
  const groupSnaps = await getDocs(collection(db, `groups/${groupName}/users`));
  groupSnaps.forEach((doc) => {
    const tmp = doc.data();
    raw.push(tmp.userName);
  });

  const result = shuffle(raw)
    .map((value, index) => `${index + 1}. ${value}`)
    .join("\n~~~~~~~~~~~~~~~~~~~\n");

  return `"${groupName}"グループのメンバーをランダムに並べ替えました！🎲
========================================================================
${result}`;
};

const shuffle = (array: string[]) => {
  const copyArray = array.slice();
  let m = copyArray.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = copyArray[m];
    copyArray[m] = copyArray[i];
    copyArray[i] = t;
  }

  return copyArray;
};
