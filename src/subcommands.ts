const botName = "U02PXKJA27K";

export const SubCommandPattern = {
  ping: new RegExp(`^\<\@${botName}\> ping.*`),
  add: new RegExp(`^\<\@${botName}\> add.*`),
  delete: new RegExp(`^\<\@${botName}\> (delete|remove).*`),
  create: new RegExp(`^\<\@${botName}\> create.*`),
  list: new RegExp(`^\<\@${botName}\> list.*`),
  disband: new RegExp(
    `^\<\@${botName}\> (disband|delete-group|remove-group).*`,
  ),
  randomSort: new RegExp(`^\<\@${botName}\> random\-sort.*`),
};
