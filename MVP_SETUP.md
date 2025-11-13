# 立ち位置セレクター MVP

2択の質問に対して、ユーザーが左右の一次元ライン上で自分の立ち位置を選択・可視化するWebアプリケーション。

## 概要

- **プロダクト**: ユーザーが「左↔右」の一次元スライダー上で、質問に対する自分の意見を表現
- **入力方法**: 四角い選択エリア上でマウスクリック/ドラッグ、またはキーボード操作
- **値の範囲**: 0-100の連続値として扱い、選択位置に◯マーカーを表示

## 技術スタック

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Code Quality**: Biome (Linter & Formatter)
- **UI Components**: shadcn/ui (基盤のみ)

## 実装された機能

### 1. コアコンポーネント

#### PositionArea (`src/components/PositionArea.tsx`)
- **機能**: インタラクティブな位置選択エリア
- **操作方法**:
  - マウス/タッチでクリック・ドラッグ
  - キーボード操作 (← → で±1、Shift+矢印で±10、Home/End)
- **アクセシビリティ**:
  - `role="slider"` と完全なARIA属性
  - フォーカスリングとキーボードナビゲーション
- **UI要素**:
  - 目盛り表示 (0, 25, 50, 75, 100)
  - 選択位置の◯マーカー
  - 現在値の数値表示
  - 操作説明テキスト

#### QuestionList (`src/components/QuestionList.tsx`)
- 質問一覧をカード形式で表示
- 回答済み/未回答の状態表示
- 回答済みの場合は現在値を表示

#### QuestionPage (`src/app/questions/[id]/page.tsx`)
- 個別質問の詳細ページ
- PositionAreaコンポーネントの統合
- 質問一覧への戻るナビゲーション

### 2. データ管理

#### 型定義 (`src/types/question.ts`)
```typescript
export interface Question {
  id: string;
  title: string;
  left: string;  // 左側ラベル
  right: string; // 右側ラベル
}
```

#### 静的質問データ (`src/data/questions.ts`)
3つのハードコードされた質問:
1. 「恋人いる？」って聞くのはアリ？ナシ？
2. 初対面でタメ口はアリ？ナシ？
3. 上司への雑談は必要？不要？

#### LocalStorage (`src/lib/storage.ts`)
- 回答の永続化 (バックエンド不要)
- `position-selector-responses` キーでJSON保存
- 質問ID → スコア (0-100) のマッピング

### 3. デザイン

- **日本語最適化**: Hiragino Sans, Yu Gothic UI, Meiryo等
- **行間・文字間**: 読みやすさを考慮 (line-height: 1.7, letter-spacing: 0.02em)
- **ダーク/ライトモード**: 自動対応 (prefers-color-scheme)
- **ミニマルデザイン**: 余白広め、コントラスト十分
- **カラーパレット**: Zinc系の落ち着いた色調 + Blue accent

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

### 3. プロダクションビルド

```bash
npm run build
npm run start
```

### 4. コード品質チェック

```bash
# Linterチェック
npm run lint

# 自動修正
npm run lint:fix

# フォーマット
npm run format
```

## ページ構成

```
/                          # トップページ（質問一覧）
/questions/[id]            # 質問詳細ページ
```

## ファイル構造

```
src/
├── app/
│   ├── layout.tsx                # ルートレイアウト (lang="ja")
│   ├── page.tsx                  # トップページ
│   └── questions/[id]/page.tsx   # 質問詳細ページ
├── components/
│   ├── PositionArea.tsx          # 位置選択エリア
│   └── QuestionList.tsx          # 質問一覧
├── data/
│   └── questions.ts              # 静的質問データ
├── lib/
│   ├── storage.ts                # LocalStorage管理
│   └── utils.ts                  # ユーティリティ
└── types/
    └── question.ts               # 型定義
```

## 主要ロジック

### 座標→スコア変換

```typescript
const calculateValueFromPosition = (clientX: number): number => {
  const rect = containerRef.current.getBoundingClientRect();
  const x = clientX - rect.left;
  const percentage = (x / rect.width) * 100;
  return clamp(Math.round(percentage), 0, 100);
};
```

### LocalStorage保存

```typescript
export const saveResponse = (questionId: string, value: number): void => {
  const responses = getResponses();
  responses[questionId] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
};
```

## テスト観点

### 単体テスト方針 (実装は今後)

1. **座標変換テスト**:
   - `calculateValueFromPosition()` の境界値テスト (0, 50, 100)
   - クランプ処理の検証 (負値、100超)

2. **LocalStorageテスト**:
   - 保存・読み込みの正常動作
   - JSONパースエラーのハンドリング
   - window未定義時の挙動 (SSR対応)

3. **アクセシビリティテスト**:
   - キーボード操作の完全性
   - ARIA属性の存在確認
   - フォーカス管理

4. **UI/UXテスト**:
   - タッチイベントの動作確認
   - モバイル最適化
   - ダークモード切替

## 非機能要件

### セキュリティ
- XSS対策: 質問データは静的ハードコードのため最小限
- 入力値のクランプ処理で不正値を防止

### パフォーマンス
- CSRのみ (SSR不要)
- 軽量でインタラクションは即時反応
- PointerEventsで効率的なイベント処理

### アクセシビリティ
- WAI-ARIA 1.2準拠 (slider role)
- キーボード完全対応
- スクリーンリーダー対応
- 十分なコントラスト比

### レスポンシブ
- モバイルファースト
- タップ領域の最適化
- 指で隠れない◯マーカー配置

## MVP範囲外

以下の機能は今後の拡張として除外:
- ユーザー認証・アカウント機能
- バックエンドAPI
- 質問の動的作成・編集
- 回答の共有機能
- 統計・分析機能
- ソーシャル機能

## ライセンス

Private project
