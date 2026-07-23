# AI ウェブサイトクローンテンプレート

[English](README.md) | 日本語

<a href="https://github.com/JCodesMore/ai-website-cloner-template/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" /></a> <a href="https://github.com/JCodesMore/ai-website-cloner-template/stargazers"><img src="https://img.shields.io/github/stars/JCodesMore/ai-website-cloner-template?style=flat" alt="Stars" /></a> <a href="https://discord.gg/hrTSX5yTpB"><img src="https://img.shields.io/discord/1400896964597383279?label=discord" alt="Discord" /></a>

AI コーディングエージェントを使用して任意のウェブサイトを解析し、クリーンでモダンな Next.js コードベースとして再構築するための、再利用可能なテンプレートです。

**推奨：[Claude Code](https://docs.anthropic.com/en/docs/claude-code) と Opus 4.8 の組み合わせが最良の結果を得られます** — ただし、さまざまな AI コーディングエージェントでも動作します。

URL を指定して `/clone-website` を実行すると、AI エージェントがサイトを調査し、デザイントークンとアセットを抽出し、コンポーネント仕様を作成して、各セクションを再構築するビルダーを並列に実行します。

## デモ

[![デモを見る](docs/design-references/comparison.png)](https://youtu.be/O669pVZ_qr0)

> 上の画像をクリックすると、YouTube でデモ全編を視聴できます。

## クイックスタート

> **重要：** まず GitHub の **Use this template** ボタンを使用して、自分用のコピーを作成してください。ウェブサイトプロジェクトのためにこのテンプレートリポジトリを直接クローンしたり、生成したウェブサイトのプルリクエストをこのリポジトリに作成したりしないでください。

1. **このテンプレートから自分のリポジトリを作成する**

   このプロジェクトの GitHub ページで **Use this template**、続いて **Create a new repository** をクリックします。

   新しいリポジトリに名前を付け、公開または非公開を選択してから **Create repository** をクリックします。GitHub に **Include all branches** オプションが表示された場合は、オフのままでかまいません。

   これにより、独立した自分専用のプロジェクトが作成されるため、ウェブサイトへの変更はメインテンプレートに戻されず、自分のアカウント内に保持されます。

2. **新しいリポジトリを自分のコンピューターで開く**

   GitHub がコピーを作成したら、その新しいリポジトリを開きます。**Code** をクリックし、好みのコーディングツールで新しいリポジトリを開くかクローンします。

   ターミナルを使用する場合、コマンドは次のようになります。

   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-NEW-REPOSITORY.git
   cd YOUR-NEW-REPOSITORY
   ```

3. **依存関係をインストールする**
   ```bash
   npm install
   ```
4. **AI エージェントを起動する** — Claude Code を推奨：
   ```bash
   claude --chrome
   ```
5. **スキルを実行する**：
   ```
   /clone-website <target-url1> [<target-url2> ...]
   ```
6. **カスタマイズする**（任意）— 基本のクローンが構築された後、必要に応じて変更します

> 別のエージェントを使用しますか？プロジェクトの手順については `AGENTS.md` を開いてください。ほとんどのエージェントはこのファイルを自動的に読み込みます。

## 対応プラットフォーム

| エージェント                                                  | 状態                    |
| ------------------------------------------------------------- | ----------------------- |
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | **推奨** — Opus 4.8     |
| [Codex CLI](https://github.com/openai/codex)                  | 対応                    |
| [OpenCode](https://opencode.ai/)                              | 対応                    |
| [GitHub Copilot](https://github.com/features/copilot)         | 対応                    |
| [Cursor](https://cursor.com/)                                 | 対応                    |
| [Windsurf](https://codeium.com/windsurf)                      | 対応                    |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli)     | 対応                    |
| [Cline](https://github.com/cline/cline)                       | 対応                    |
| [Roo Code](https://github.com/RooCodeInc/Roo-Code)            | 対応                    |
| [Continue](https://continue.dev/)                             | 対応                    |
| [Amazon Q](https://aws.amazon.com/q/developer/)               | 対応                    |
| [Augment Code](https://www.augmentcode.com/)                  | 対応                    |
| [Aider](https://aider.chat/)                                  | 対応                    |

## 前提条件

- [Node.js](https://nodejs.org/) 24 以降
- AI コーディングエージェント（[対応プラットフォーム](#対応プラットフォーム)を参照）

## 技術スタック

- **Next.js 16** — App Router、React 19、TypeScript strict
- **shadcn/ui** — Radix プリミティブ + Tailwind CSS v4
- **Tailwind CSS v4** — oklch デザイントークン
- **Lucide React** — デフォルトのアイコン（クローン作成時に抽出した SVG に置き換えられます）

## 仕組み

`/clone-website` スキルは、複数フェーズのパイプラインを実行します。

1. **調査** — スクリーンショット、デザイントークンの抽出、インタラクションの網羅的な確認（スクロール、クリック、ホバー、レスポンシブ）
2. **基盤構築** — フォント、色、グローバル設定を更新し、すべてのアセットをダウンロード
3. **コンポーネント仕様** — 正確に算出された CSS 値、状態、動作、コンテンツを含む詳細な仕様ファイルを `docs/research/components/` に作成
4. **並列ビルド** — セクションまたはコンポーネントごとに 1 つずつ、git worktree 内でビルダーエージェントを実行
5. **統合と QA** — worktree をマージしてページを接続し、元のサイトとのビジュアル差分を確認

各ビルダーエージェントは、正確な `getComputedStyle()` の値、インタラクションモデル、複数状態のコンテンツ、レスポンシブのブレークポイント、アセットのパスを含む完全なコンポーネント仕様をインラインで受け取ります。推測は行いません。

## 使用例

- **プラットフォーム移行** — 所有しているサイトを WordPress、Webflow、Squarespace からモダンな Next.js コードベースへ再構築
- **ソースコードの喪失** — サイトは公開中でもリポジトリが失われた、開発者が離任した、または技術スタックが旧式になった場合に、コードをモダンな形式で取り戻す
- **学習** — 実際のコードを扱いながら、本番サイトが特定のレイアウト、アニメーション、レスポンシブ動作をどのように実現しているかを分解して理解

## 想定していない用途

- **フィッシングまたはなりすまし** — このプロジェクトを、欺瞞的な目的、なりすまし、または法律に違反する活動に使用してはなりません。
- **他者のデザインを自分のものとして扱うこと** — ロゴ、ブランドアセット、オリジナルの文章は、それぞれの所有者に帰属します。
- **利用規約への違反** — 一部のサイトではスクレイピングや複製が明示的に禁止されています。事前に確認してください。

## プロジェクト構成

```
src/
  app/              # Next.js routes
  components/       # React components
    ui/             # shadcn/ui primitives
    icons.tsx       # Extracted SVG icons
  lib/utils.ts      # cn() utility
  types/            # TypeScript interfaces
  hooks/            # Custom React hooks
public/
  images/           # Downloaded images from target
  videos/           # Downloaded videos from target
  seo/              # Favicons, OG images
docs/
  research/         # Extraction output & component specs
  design-references/ # Screenshots
scripts/
  sync-agent-rules.sh  # Regenerate agent instruction files
  sync-skills.mjs      # Regenerate /clone-website for all platforms
AGENTS.md           # Agent instructions (single source of truth)
CLAUDE.md           # Claude Code config (imports AGENTS.md)
GEMINI.md           # Gemini CLI config (imports AGENTS.md)
```

## コマンド

```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run lint   # ESLint check
npm run typecheck # TypeScript check
npm run check  # Run lint + typecheck + build
```

### Docker を使用する場合

```bash
docker compose up app --build # build and run the app
docker compose up dev --build # run the app in dev mode on port 3001
```

## 他のプラットフォーム向けの更新

2 つの信頼できる情報源となるファイルが、すべてのプラットフォーム対応を支えています。ソースを編集してから、同期スクリプトを実行してください。

| 対象                   | 信頼できる情報源                         | 同期コマンド                       |
| ---------------------- | ---------------------------------------- | ---------------------------------- |
| プロジェクトの手順     | `AGENTS.md`                              | `bash scripts/sync-agent-rules.sh` |
| `/clone-website` スキル | `.claude/skills/clone-website/SKILL.md` | `node scripts/sync-skills.mjs`     |

各スクリプトは、プラットフォーム固有のコピーを自動的に再生成します。ソースファイルをネイティブに読み取るエージェントでは、再生成は不要です。


## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=JCodesMore/ai-website-cloner-template&type=Date)](https://star-history.com/#JCodesMore/ai-website-cloner-template&Date)

## ライセンス

MIT
