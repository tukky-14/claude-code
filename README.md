# Claude Code 学習

### 使用状況を確認

```bash
npx ccusage@latest

# 参考
# https://zenn.dev/ryoppippi/articles/6c9a8fe6629cd6
```

### 作業完了後に通知音を設定

```bash
# mac登録されている音を再生する
for sound in /System/Library/Sounds/*.aiff; do name=$(basename "$sound" .aiff); echo "♪ $name"; afplay "$sound"; done

# 気に入った音を登録する
afplay /System/Library/Sounds/Glass.aiff

# 参考
# https://zenn.dev/karaage0703/articles/1cb99d9fca145f
```

### メモ

・タスク終了後にコードフォーマットをかける
・ログ記録の自動化
・要件書、設計書、実装計画を作成する
