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
  return {
    command: text ? text.split(" ") : [],
    rawMessage: text,
    forceTypedEvent,
    user,
  };
};
