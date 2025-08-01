# レシピブックマークまとめサイト 要件定義書（簡易版）

## 1. 目的

複数の料理サイトから取得したレシピ URL を一元管理し、カテゴリ・タグで簡単に絞り込みながら閲覧できる “自分専用レシピまとめサイト” を提供する。詳細ページは外部サイトへ遷移し、当サイトではリンクとメタ情報のみを扱う。

## 2. スコープ

フロントエンド完結（サーバーレス）SPA。ブラウザにデータを永続化し、任意で JSON 形式のエクスポート／インポートを行う。

## 3. 機能要件

3.1 レシピ登録  
　 A. URL 手動登録  
　 B. URL 一括取り込み（改行区切り／CSV／JSON を貼り付け）  
　 C. 自動メタデータ補完（サイトタイトル or `<title>` 取得、取得失敗時は手入力）

3.2 レシピ閲覧  
　 A. カードレイアウトでサムネイル（OGP 画像取得／代替アイコン）＋タイトル＋カテゴリ＋タグを表示  
　 B. カードクリックで新規タブに外部サイトを開く

3.3 フィルタリング  
　 A. カテゴリ別フィルタ（単一選択）  
　 B. タグ検索（複数 OR 条件）  
　 C. フリーワード検索（タイトル・URL）

3.4 データ管理  
　 A. エクスポート：全データを JSON ダウンロード  
　 B. インポート：JSON アップロードで上書き／マージを選択  
　 C. データ削除：選択削除・全削除

3.5 UI/UX  
　 A. レスポンシブ（モバイル優先）  
　 B. ダーク／ライトテーマ自動切替（OS 設定追従）  
　 C. Undo 機能（直前の削除・編集を 1 ステップ戻す）

## 4. 非機能要件

- ローカルストレージまたは IndexedDB で永続化
- オフラインでも閲覧・編集可能（PWA optional）
- パフォーマンス：1000 件程度で快適に動作
- アクセシビリティ：キーボード操作・AR Ia ラベル対応

## 5. データモデル（概略）

```
Recipe {
  id: string          // UUID
  url: string
  title: string
  category: string    // 任意 1 件
  tags: string[]      // 0-N 件
  image: string       // OGP または空
  createdAt: Date
  updatedAt: Date
}
```

## 6. 画面一覧

1. 一覧画面（メイン）

   - フィルタパネル（カテゴリドロップダウン、タグ入力フィールド、検索窓）
   - レシピカードグリッド
   - FAB：追加／一括取込／エクスポート

2. 登録・編集ダイアログ

   - URL 入力 → 自動タイトル取得
   - カテゴリ選択、新規カテゴリ追加
   - タグ入力（トークン型）

3. 設定ダイアログ
   - データインポート／初期化
   - テーマ選択（自動／ライト／ダーク）

## 7. 制約・前提

- サーバーを持たないため、クロスサイトの OGP 取得はフロントから直接 fetch。CORS 制限時は画像取得をスキップ。
- 同期機能（多端末間共有）は要件外。ユーザ自身がエクスポート／インポートで移行。

## 8. 開発・技術スタック（推奨）

- Framework: Next.js (App Router, TypeScript)
- 状態管理: Zustand / Redux Toolkit (minimal)
- 永続化: IndexedDB (idb ライブラリ)
- UI: Tailwind CSS + Headless UI
- ビルド／デプロイ: Vercel

## 9. マイルストーン

1. プロジェクトセットアップ・データモデル実装
2. CRUD（単一 URL 登録 / 編集 / 削除）
3. 一括取り込み・エクスポート／インポート
4. フィルタリング UI
5. PWA & デザイン微調整
6. 動作テスト・リリース

## 10. 受け入れ基準（抜粋）

- URL を 50 件まとめて貼り付け、すべてカード化できる
- カテゴリ・タグで瞬時にフィルタされる
- エクスポート → 新しいブラウザにインポート → 同一状態を再現
- オフライン時でもページ遷移・フィルタリングが動作

以上
