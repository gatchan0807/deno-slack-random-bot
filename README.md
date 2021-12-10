# deno-slack-random-bot

BASE社のSlackワークスペースにて稼働させるために作成したSlack Bot

下記のようなコマンドを受け付け、指定のシャッフルを行う

```
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
```

2021年12月のアドベントカレンダー用の記事で詳細は紹介されている
=> [Slack Bot開発編]() / [Deno基礎知識・環境構築編]()

## 利用技術

- ランタイム: Deno（v1.16.4）
- ストア: Firebase Firestore
- 本番実行環境: Cloud Run（DenoのDockerコンテナを作成）
- ※開発環境: GitHub Codespaces（実行コードはすべてここで記述。Dockerコンテナの動作検証時にのみMacローカルにて実行）
