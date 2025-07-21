# Cook Pocket 🍳

**あなただけのレシピコレクション** - お気に入りのレシピ URL を一元管理できる Web アプリケーション

[![デプロイ先](https://img.shields.io/badge/Live%20Demo-cook--pocket.vercel.app-blue)](https://cook-pocket.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC)](https://tailwindcss.com/)

## 🌟 概要

Cook Pocket は、インターネット上の様々な料理サイトから見つけたレシピの URL を収集・整理し、カテゴリやタグで簡単に検索できるパーソナルレシピブックマークサービスです。

**🔗 公開 URL**: [https://cook-pocket.vercel.app/](https://cook-pocket.vercel.app/)

## ✨ 主な機能

### 📝 レシピ管理

- **URL 登録**: レシピページの URL を簡単に保存
- **自動メタデータ取得**: サイトタイトルや OGP 画像を自動取得
- **一括インポート**: JSON ファイルからの一括データ取り込み
- **データエクスポート**: レシピデータを JSON ファイルでバックアップ

### 🔍 検索・フィルタリング

- **カテゴリ別フィルタ**: レシピをカテゴリごとに整理
- **タグ検索**: 複数タグでの絞り込み検索
- **フリーワード検索**: タイトルや URL での全文検索

### 🎨 ユーザビリティ

- **レスポンシブデザイン**: モバイル・デスクトップ両対応
- **ダークモード**: システム設定に自動追従
- **オフライン対応**: ブラウザストレージでオフライン閲覧可能

## 🛠 技術スタック

- **フレームワーク**: Next.js 15.4.2 (App Router)
- **言語**: TypeScript 5
- **スタイリング**: Tailwind CSS 4
- **状態管理**: Zustand 5.0.6
- **データストレージ**: IndexedDB (idb 8.0.3)
- **アイコン**: Heroicons 2.2.0
- **デプロイ**: Vercel

## 🚀 開発環境のセットアップ

### 前提条件

- Node.js 18.0.0 以上
- npm, yarn, pnpm, または bun のいずれか

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd cook-pocket

# 依存関係をインストール
npm install
# または
yarn install
# または
pnpm install
# または
bun install
```

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて、アプリケーションを確認してください。

`src/app/page.tsx` を編集すると、ページがリアルタイムで更新されます。

## 📱 使用方法

### 1. レシピの追加

1. 右上の「レシピを追加」ボタンをクリック
2. レシピページの URL を入力
3. タイトルが自動取得されない場合は手動で入力
4. カテゴリとタグを設定
5. 「保存」をクリック

### 2. レシピの検索・フィルタリング

- **カテゴリフィルタ**: 上部のドロップダウンから選択
- **タグ検索**: タグ入力フィールドに入力
- **フリーワード検索**: 検索ボックスにキーワードを入力

### 3. データの管理

- **エクスポート**: ヘッダーの「エクスポート」ボタンで JSON ファイルをダウンロード
- **インポート**: ヘッダーの「インポート」ボタンで JSON ファイルをアップロード

## 📦 ビルド

### 本番用ビルド

```bash
npm run build
npm run start
```

### Lint チェック

```bash
npm run lint
```

## 🏗 プロジェクト構成

```
src/
├── app/                  # Next.js App Router
│   ├── api/             # API routes
│   ├── globals.css      # グローバルスタイル
│   ├── layout.tsx       # ルートレイアウト
│   └── page.tsx         # ホームページ
├── components/          # React コンポーネント
│   ├── AddRecipeModal.tsx
│   ├── EditRecipeModal.tsx
│   ├── FilterPanel.tsx
│   ├── RecipeCard.tsx
│   └── ...
├── lib/                 # ライブラリとユーティリティ
│   └── storage.ts       # IndexedDB操作
├── store/               # 状態管理
│   └── recipeStore.ts   # Zustandストア
├── types/               # TypeScript型定義
│   └── recipe.ts
└── utils/               # ユーティリティ関数
    ├── dataUtils.ts
    ├── metadata.ts
    └── tagUtils.ts
```

## 🎯 今後の改善予定

- [ ] PWA (Progressive Web App) 対応
- [ ] レシピの評価・お気に入り機能
- [ ] 栄養情報の表示
- [ ] レシピの共有機能
- [ ] 材料での検索機能

## 🤝 コントリビューション

プルリクエストや Issues は歓迎します！改善提案がある場合は、お気軽にお声がけください。

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

---

**Cook Pocket**で、あなたのレシピコレクションを整理して、料理の時間をもっと楽しくしましょう！🍽️
