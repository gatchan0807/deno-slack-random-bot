const botName = "U02PXKJA27K";

export const SubCommandPattern = {
  add: new RegExp(`^\<\@${botName}\> add.*`),
  delete: new RegExp(`^\<\@${botName}\> (delete|remove).*`),
  create: new RegExp(`^\<\@${botName}\> create.*`),
  randomSort: new RegExp(`^\<\@${botName}\> random\-sort.*`),
};
