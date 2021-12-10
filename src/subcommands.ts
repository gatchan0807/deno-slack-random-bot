const botName = "botname";

export const SubCommandPattern = {
  ping: new RegExp(`^\<\@${botName}\> ping.*`),
  help: new RegExp(`^\<\@${botName}\> (help|h).*`),
  add: new RegExp(`^\<\@${botName}\> add.*`),
  delete: new RegExp(`^\<\@${botName}\> (delete|remove).*`),
  create: new RegExp(`^\<\@${botName}\> create.*`),
  list: new RegExp(`^\<\@${botName}\> list.*`),
  disband: new RegExp(
    `^\<\@${botName}\> (disband|delete-group|remove-group).*`,
  ),
  randomSort: new RegExp(`^\<\@${botName}\> random\-sort.*`),
  pick: new RegExp(`^\<\@${botName}\> pick.*`),
  separate: new RegExp(`^\<\@${botName}\> separate.*`),
};

export const helpMessage = `使い方の説明ッ！
========================================================================
⚠ コピペすると、コマンドに見えないスペースが入ってしまって無視される場合があるのでお気をつけください🙏

~~~~~~~ 便利コマンド系 ~~~~~~~
@/random-bot (help|h) 👉 ヘルプの表示
@/random-bot ping 👉 起動確認（バックエンドがCloud Runのため、使われていないと寝ていることがあるので先にこれを叩いておくとレスポンスが早く返って来やすくなります）
~~~~~~~ データ登録・削除系 ~~~~~~~
@/random-bot create [group-name] 👉 グループ（メンバーを追加する枠）の作成
@/random-bot (disband|delete-group|remove-group) [group-name] 👉 グループ（メンバーを追加する枠）の解散
@/random-bot list [group-name] 👉 グループ内のメンバー一覧の表示
@/random-bot add [group-name] [member-name] 👉 グループにメンバーの追加（メンバー名はテキストもメンションもどちらも登録可能です）
@/random-bot (delete|remove) [group-name] [member-name] 👉 グループからメンバーの削除
~~~~~~~ シャッフル実行系 ~~~~~~~
@/random-bot random-sort [group-name] 👉 グループ内のメンバー一覧をシャッフルして並び替え
@/random-bot pick [group-name] [number] 👉 グループ内のメンバー一覧からランダムに指定の人数ピックアップ
@/random-bot separate [group-name] [divide-count] [merge-option] 👉 グループ内のメンバーを指定の人数ごとに分ける（merge-optionにfalseを設定しない場合、1人になったチームは最後のチームに合流します）
`;
