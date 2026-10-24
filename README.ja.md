<div align="center">

```
██╗     ██╗     ███╗   ███╗██╗  ██╗
██║     ██║     ████╗ ████║╚██╗██╔╝
██║     ██║     ██╔████╔██║ ╚███╔╝
██║     ██║     ██║╚██╔╝██║ ██╔██╗
███████╗███████╗██║ ╚═╝ ██║██╔╝ ██╗
╚══════╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝
```

# llmxapi-bulk-apikey

**一码科技 (hk.llmxapi.com) のアカウントを API キー付きで一括作成 — OpenAI 互換推論 + 9Router コネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-undefined%20served-412991?style=for-the-badge)](https://hk.llmxapi.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-undefined-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ これが存在する理由

hk.llmxapi.com (一码科技) は **New API** パネル (`hk.llmxapi.com`) で、メールコードによるサインアップ、パスワード登録が開放されており、キャプチャなし、OpenAI 互換の `https://hk.llmxapi.com/v1` 推論を提供しています。有用な単位は *キーごとに 1 アカウント* であるため、このツールはそれを `keys.txt` に変換します。そこでは **すべての行が実際のチャット呼び出し** と `tools` プローブを通過しています。登録クレジットは少額なので、1 つのキーはおよそ 1 回の短いセッション分の価値があります。それを補充するチェックインはありません。

## 🎁 無料枠 — どれだけ得られるか

| 項目 | 値 |
| --- | --- |
| サインアップクレジット | 約 100 000 クォータ ≈ **$0.20** (`quota_per_unit` 500 000) |
| 毎日のチェックイン | **なし** (`checkin_enabled=false`) |
| カード必須 | **いいえ** |
| キャプチャ | **オフ** (`turnstile_check=false`) |
| メール | コード、ドットなし gmail も可 |

カード不要、キャプチャ不要: 1 つのキーはパネルが受け入れる 1 つのアドレスで済みます。

> 💡 無料枠は hk.llmxapi.com (一码科技) によって設定されており、変更される可能性があります。最新の数値は [hk.llmxapi.com](https://hk.llmxapi.com) で確認してください — そしてツール自身のゲートに判断させてください:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 モデル — そのすべて undefined

カタログはトークングループごとに提供されます。検証済みのライブ ID: `deepseek-v4.1-flash`、`deepseek-v4-flash`。`deepseek-v4.1-flash` は CLI のデフォルトであり、このリポジトリのすべての検証で使用されるモデルです。

## 🧪 API の使い方

ベース URL は **`https://hk.llmxapi.com/v1`** です — OpenAI 互換なので、OpenAI を話せるものなら何でも動作します。

```bash
curl https://hk.llmxapi.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 クイックスタート

```bash

# clone or fork this repository, then:
cd llmxapi-bulk-apikey

# 1) your proxy list, one per line (http://… or socks5://…) — optional
printf 'http://127.0.0.1:8080\n' > proxies.txt

# 2) go
node src/launcher.js                 # interactive
# or directly:
node src/cli.js --count N                    # the one command — mint N accounts (no captcha, no browser)
node src/cli.js --revive --pool proxies.txt   # re-login stored accounts, check in, re-mint
node src/cli.js --verify                       # re-test every key in keys.txt
```

`keys.txt` は、実際のチャット補完がキーを証明した **後にのみ** 書き込まれます。

### 🖱️ ランチャー

ランチャーはプロキシリスト、件数、モデルを尋ね、それらを `launcher.config.json` に記憶し、適切なフラグを付けて CLI を実行します。

## ✅ 動作検証済み — すべてのキーがテストされています

| チェック | 結果 |
| --- | --- |
| キーを使った `https://hk.llmxapi.com/v1/models` | **200** — 実際のカタログ |
| キーごとに 2 回のライブ `POST /chat/completions` 呼び出し | **200**、空でないコンテンツ |
| `tools` — 1 回の `get_time` ツール呼び出し、`tool_choice: auto` | **get_time tool_call が返された** |
| この実行 (`preadd-gate.js --pool`、fail-closed 終了) | **10 ライブ / 34 キー試行** (24 デッド) |
| チャットチェックに失敗したキー | `keys.txt` に書き込まれることは決してない |

> **品質ゲート。** ここにあるすべてのキーは、`keys.txt` に書き込まれる前にライブ `chat-200` を通過しています
> (デッドキーは決して出荷されません)。ルーターのコンボもモデルレベルで同じルールに従います: エントリは
> **モデルが `chat-200` に応答し、ツールを呼び出せる場合にのみ** 追加されます — ツールサポートのないモデル、
> デッドキー、デッドプロバイダは追加されずに破棄されます。検証ステップはいつでも再実行できます;
> 失敗は報告され、決して隠されません。

## 🧭 仕組み

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: hk.llmxapi.com (一码科技) page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://hk.llmxapi.com/v1/chat/completions → real content = the key is live
```

| ステップ | 呼び出し | 備考 |
| --- | --- | --- |
| code | `GET /api/verification?email=<addr>` | パネルは許可リストの判定をそのまま返します |
| signup | `POST /api/user/register` | Turnstile はオフ; 6 文字のコードがメールで届きます |
| sign-in | `POST /api/user/login` | `data.access_token` (JWT) — このフォークはセッションクッキーを **使用しません** |
| credit | `POST /api/user/checkin` | 毎日、無料 |
| token | `POST /api/token/` with `{"group":"default"}` | 提供グループ外のトークンは 403 を返します |
| key | `POST /api/token/<id>/key` | リストはキーをマスクしますが、reveal エンドポイントはマスクしません |
| check | `POST /v1/chat/completions` and a `tools` call | `keys.txt` の前にライブ 200 + tool_call が必須 |

## ⚙️ CLI オプション

```bash
node src/cli.js --count N            # mint N accounts (default 1)
node src/cli.js --revive             # re-login accounts.jsonl, check in, mint a fresh key
node src/cli.js --verify             # re-check every key in keys.txt
node src/cli.js --pool proxies.txt   # rotate exits, one exit per account
node src/cli.js --connect-9router    # register the provider on a local 9Router
node src/cli.js --help
```

| 環境変数 | デフォルト | 意味 |
| --- | --- | --- |
| `LLMXAPI_BASE` | `https://hk.llmxapi.com` | パネルのベース URL |
| `LLMXAPI_PROXIES` | – | オプションのプールファイル、1 行に 1 つの出口 |

## 🛰️ プロキシの背後で

**オプション、大規模では推奨** (IP ごとのレート制限と BAN)。1 行に 1 つの出口 (`http://`、`https://` CONNECT、または `socks5://`) を含むファイルを `--pool <file>` で渡します; 各アカウントは次の出口を使用し、デッドラインはその試行のみを失敗させます。プールなしの場合、ツールは直接接続します。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | 1 行に 1 つのライブ検証済みキー — git で無視 |
| `accounts.jsonl` | アカウントごとのアドレス / ユーザー名 / パスワード / キー / チャットステータス |
| `proxies.txt` | あなたの出口、1 行に 1 つ — git で無視 |

## 🔌 9Router への接続

[9Router](https://9router.com) はセルフホストの OpenAI 互換ルーターです。このプロバイダを一度登録すれば、すべてのキーが 1 つのプロバイダノードの下の接続になります:

```bash
node src/connect-9router.js
```

デフォルト: `--base http://localhost:20128`、`--password 123456`、`--name "hk.llmxapi.com (一码科技)"`、`--prefix llmxapi`、`--base-url https://hk.llmxapi.com/v1`。モデルは `llmxapi/<model id>` として提供され、すべてのキーにわたってロードバランスされます。

## 🔌 OmniRoute への接続

[OmniRoute](https://omniroute.online) はセルフホストの OpenAI 互換ルーターです。このプロバイダを一度登録すれば、すべてのキーが 1 つのプロバイダノードの下の接続になります:

```bash
node src/connect-omniroute.js
```

デフォルト: `--base http://localhost:20128`、`--password 123456`、`--name "hk.llmxapi.com (一码科技)"`、`--prefix llmxapi`、`--base-url https://hk.llmxapi.com/v1`。モデルは `llmxapi/<model id>` として提供され、すべてのキーにわたってロードバランスされます。

## 🔑 1 つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダ | **hk.llmxapi.com (一码科技)** — [hk.llmxapi.com](https://hk.llmxapi.com) |
| 🎁 プロバイダが提供するもの | キーごとに 1 アカウント — メールコードサインアップ、すべてのキーがチャット検証済み |
| 🔑 1 つのキーで得られるもの | 自身のアカウントにスコープされた 1 つの API キー: 以下のエンドポイントの完全なモデル ID を、あなたのプランの制限で。クォータは **アカウント** に存在し、まさにそれがこのツールがキーごとに 1 アカウントを作成する理由です |
| 🌐 API の形 | OpenAI 互換: `POST https://hk.llmxapi.com/v1/chat/completions` |
| 🔒 あなたのデータ | 接触するのは hk.llmxapi.com とあなたが設定した inbox バックエンドのみ; キーはあなたのマシンに留まります |

## 🐞 Issues

パネルがサインアップの形、グループ、クレジットを変更した場合、ツールはそのステップで停止し、パネルの応答をそのまま出力します。実行したコマンドと正確な出力を添えて **[issue を開いてください](../../issues)**; PR も歓迎します。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照。

<div align="center">

**[MIT](LICENSE)** © 2026 llmxapi-bulk-apikey contributors

</div>