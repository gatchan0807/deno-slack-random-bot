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
