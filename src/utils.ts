import {
  GenericMessageEvent,
  SlackEvent,
} from "https://deno.land/x/slack_bolt@1.0.0/mod.ts";

export const formatMessage = (
  event: Extract<SlackEvent, { type: "message" }>,
) => {
  const forceTypedEvent = event as GenericMessageEvent;
  const text = forceTypedEvent.text;
  const user = forceTypedEvent.user;

  const rawCommand = text?.split(" ") ?? [];

  const [botname, subcommand, ...commandArgs] = rawCommand;
  const command: BotCommand = {
    botname: botname ?? null,
    subcommand: subcommand ?? null,
    args: commandArgs,
  };

  return {
    rawText: text,
    command,
    forceTypedEvent,
    user,
  };
};

export type BotCommand = {
  botname: string | null;
  subcommand: string | null;
  args: Array<string | undefined>;
};

export const shuffle = (array: string[]) => {
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
