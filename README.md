# Project Rules

AIコーディングエージェント（CursorやCline）のための設定ファイルを生成するプロジェクトだよい。

## 概要

このプロジェクトは、AIコーディングエージェント（CursorやCline）が従うべきルールやガイドラインを定義し、それらを適切な形式の設定ファイルに変換するためのツールだよい。Markdownで書かれたルールファイルを、各AIツールが理解できる形式（.mdcファイルや.clinerules）に変換するよい。

## 機能

- Markdownファイルを結合して.mdcファイル（Cursor用の設定ファイル）を生成
- .mdcファイルを結合して.clinerules（Cline用の設定ファイル）を生成
- ファイル名の数字プレフィックスに基づいたソート機能

## ディレクトリ構造

```
project-rules/
├── rules/                  # メインのルールディレクトリ
│   ├── build.ts            # ビルドスクリプト
│   ├── cline.ts            # Cline設定ファイル生成ロジック
│   ├── cursor.ts           # Cursor設定ファイル生成ロジック
│   ├── util.ts             # ユーティリティ関数
│   ├── common/             # 共通ルール（ベストプラクティス）
│   │   ├── 000_init.md     # 初期化設定
│   │   ├── 001_basic.md    # 基本原則
│   │   ├── 002_principle.md # 開発原則
│   │   ├── 003_git.md      # Gitワークフロー
│   │   └── 999_marco.md    # AIの人格設定
│   └── general/            # 一般的なルール
│       ├── 000_init.md     # 初期化設定
│       ├── 001_intro.md    # 導入
│       ├── 002_check_instruction.md # 指示確認
│       ├── 003_step1.md    # ステップ1: 指示の分析と計画
│       ├── 004_step2.md    # ステップ2: タスクの実行
│       ├── 005_step3.md    # ステップ3: 品質管理と問題対応
│       ├── 006_step4.md    # ステップ4: 最終確認
│       ├── 007_step5.md    # ステップ5: 結果報告
│       └── 008_caution.md  # 注意事項
├── .cursor/                # Cursor設定ファイル出力先（自動生成）
│   └── rules/              # 生成されたルールファイル
├── .clinerules             # Cline設定ファイル（自動生成）
├── package.json            # プロジェクト設定
└── tsconfig.json           # TypeScript設定
```

## 使い方

### 設定ファイルの生成

```bash
# 依存関係のインストール
npm install

# 設定ファイルの生成
npm run build
```

このコマンドを実行すると、以下の処理が行われるよい：

1. `rules/common/` と `rules/general/` ディレクトリ内のMarkdownファイルが読み込まれる
2. ファイル名の数字プレフィックスに基づいてソートされる
3. `.cursor/rules/` ディレクトリに.mdcファイルとして出力される
4. 生成された.mdcファイルが結合され、ルートディレクトリに`.clinerules`ファイルとして出力される

### 新しいルールの追加

1. 適切なディレクトリ（`rules/common/` または `rules/general/`）に新しいMarkdownファイルを作成
2. ファイル名の先頭に数字プレフィックスを付けて順序を指定（例: `004_new_rule.md`）
3. ルールの内容を記述
4. `npm run build` を実行して設定ファイルを再生成

## 含まれるルール

### 一般的なルール（general）

- タスク実行プロセス（分析、実行、品質管理、確認、報告）
- 重要な注意事項（承認プロセス、変更制限など）

### 共通ルール（common）

- 基本原則（コミュニケーション、重複防止、単一責任など）
- 開発原則（KISS, DRY, YAGNIなど）
- アーキテクチャ原則（OCP, 関心の分離など）
- Gitワークフロー（コミット、PRのベストプラクティス）
- AIの人格設定（マルコの口調）

## 技術スタック

- TypeScript
- Node.js
- glob（ファイル検索）

## ライセンス

MIT
