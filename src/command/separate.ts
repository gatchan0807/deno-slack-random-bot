import { collection, doc, getDoc, getDocs } from "../deps.ts";
import { db } from "../firestore.ts";
import { shuffle } from "../utils.ts";

export type SeparateCommandArgs = {
  groupName: string | undefined;
  divideCount: string | undefined;
  mergeOption: string | undefined;
};

export const separate = async (
  { groupName, divideCount, mergeOption }: SeparateCommandArgs,
): Promise<string> => {
  if (!groupName) {
    return `指定のグループ名が受け取れませんでした🤔`;
  }
  if (!divideCount) {
    return `チーム分けする人数の指定が受け取れませんでした🤔`;
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

  const isMerge = mergeOption !== "false";
  const count = isNaN(parseInt(divideCount)) ? parseInt(divideCount) : 2;

  const result = getSeparatedGroupList({ raw, count, isMerge });

  return `"${groupName}"グループのメンバーを"${count}"人ずつにチーム分けしました🎯
========================================================================
${result}`;
};

const getSeparatedGroupList = (
  { raw, count, isMerge }: { raw: string[]; count: number; isMerge: boolean },
): string => {
  return _formatToText(_createSeparatedArray({ raw, count, isMerge }));
};

const _createSeparatedArray = (
  { raw, count, isMerge }: { raw: string[]; count: number; isMerge: boolean },
): string[][] => {
  const separatedArray = shuffle(raw).reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / count);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] as string[];
    }

    resultArray[chunkIndex].push(item);
    return resultArray;
  }, [] as string[][]);

  if (
    isMerge &&
    separatedArray.length > 2 &&
    separatedArray[separatedArray.length - 1].length === 1
  ) {
    const last = separatedArray.length - 1;
    const oneBeforeLast = separatedArray.length - 2;

    separatedArray[oneBeforeLast] = separatedArray[oneBeforeLast].concat(
      separatedArray[last],
    );
    separatedArray.pop();
  }

  return separatedArray;
};

const _formatToText = (separatedArray: string[][]): string => {
  let result = "";
  for (const [index, teamArray] of separatedArray.entries()) {
    result += `[チーム${index + 1}]\n`;
    result += teamArray.join(" / ");
    result += "\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n";
  }
  return result;
};
