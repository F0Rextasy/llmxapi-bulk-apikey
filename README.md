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

**Bulk-create 一码科技 (hk.llmxapi.com) accounts with API keys — OpenAI-compatible inference + 9Router connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-undefined%20served-412991?style=for-the-badge)](https://hk.llmxapi.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-undefined-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Why this exists

hk.llmxapi.com (一码科技) is a **New API** panel (`hk.llmxapi.com`) with e-mail-code sign-up, password registration open, no captcha and OpenAI-compatible `https://hk.llmxapi.com/v1` inference. The useful unit is *one account per key*, so this tool turns that into a `keys.txt` where **every line survived a real chat call** and a `tools` probe. The registered credit is small, so a key is worth roughly one short session; there is no check-in to top it up.

## 🎁 Free tier — how much you get

| What | Value |
| --- | --- |
| Sign-up credit | ~100 000 quota ≈ **$0.20** (`quota_per_unit` 500 000) |
| Daily check-in | **No** (`checkin_enabled=false`) |
| Card required | **No** |
| Captcha | **Off** (`turnstile_check=false`) |
| E-mail | code, dotless gmail passes |

No card, no captcha: a key costs one address the panel accepts.

> 💡 The free tier is set by hk.llmxapi.com (一码科技) and can change. Check the live numbers at [hk.llmxapi.com](https://hk.llmxapi.com) — and let the tool's own gate decide:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Models — all undefined of them

The catalogue is served per token group. Verified live ids: `deepseek-v4.1-flash`, `deepseek-v4-flash`. `deepseek-v4.1-flash` is the default of the CLI and the model used for every verification in this repo.

## 🧪 How to use the API

The base URL is **`https://hk.llmxapi.com/v1`** — OpenAI-compatible, so anything that speaks OpenAI works.

```bash
curl https://hk.llmxapi.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 Quick start

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

`keys.txt` is written **only** after a live chat completion proves the key.

### 🖱️ The launcher

The launcher asks for the proxy list, count and model, remembers them in `launcher.config.json`, and runs the CLI with the right flags.

## ✅ Verified working — every key is tested

| Check | Result |
| --- | --- |
| `https://hk.llmxapi.com/v1/models` with the key | **200** — real catalogue |
| two live `POST /chat/completions` calls per key | **200**, non-empty content |
| `tools` — one `get_time` tool call, `tool_choice: auto` | **get_time tool_call returned** |
| this run (`preadd-gate.js --pool`, fail-closed exits) | **10 live / 34 keys tried** (24 dead) |
| a key that fails the chat check | never written to `keys.txt` |

> **Quality gates.** Every key here passed a live `chat-200` before it was written to `keys.txt`
> (dead keys are never shipped). Router combos follow the same rule at the model level: an entry is
> added **only if the model answers `chat-200` and can call tools** — a model without tool support,
> a dead key or a dead provider is dropped instead of added. Re-run the verify step any time;
> failures are reported, never hidden.

## 🧭 How it works

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: hk.llmxapi.com (一码科技) page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://hk.llmxapi.com/v1/chat/completions → real content = the key is live
```

| Step | Call | Notes |
| --- | --- | --- |
| code | `GET /api/verification?email=<addr>` | the panel answers the allow-list verdict verbatim |
| signup | `POST /api/user/register` | Turnstile is off; a 6-char code comes by mail |
| sign-in | `POST /api/user/login` | `data.access_token` (JWT) — this fork does **not** use a session cookie |
| credit | `POST /api/user/checkin` | daily, free |
| token | `POST /api/token/` with `{"group":"default"}` | a token outside a serving group answers 403 |
| key | `POST /api/token/<id>/key` | the list masks the key, the reveal endpoint does not |
| check | `POST /v1/chat/completions` and a `tools` call | live 200 + tool_call required before `keys.txt` |

## ⚙️ CLI options

```bash
node src/cli.js --count N            # mint N accounts (default 1)
node src/cli.js --revive             # re-login accounts.jsonl, check in, mint a fresh key
node src/cli.js --verify             # re-check every key in keys.txt
node src/cli.js --pool proxies.txt   # rotate exits, one exit per account
node src/cli.js --connect-9router    # register the provider on a local 9Router
node src/cli.js --help
```

| Environment variable | Default | Meaning |
| --- | --- | --- |
| `LLMXAPI_BASE` | `https://hk.llmxapi.com` | panel base URL |
| `LLMXAPI_PROXIES` | – | optional pool file, one exit per line |

## 🛰️ Behind a proxy

**Optional, recommended at scale** (per-IP rate limits and bans). Pass `--pool <file>` with one exit per line (`http://`, `https://` CONNECT or `socks5://`); every account uses the next exit, and a dead line fails only that attempt. Without a pool the tool connects directly.

## 📄 Files

| Path | Contents |
| --- | --- |
| `keys.txt` | one live-verified key per line — git-ignored |
| `accounts.jsonl` | address / username / password / key / chat status per account |
| `proxies.txt` | your exits, one per line — git-ignored |

## 🔌 Connect to 9Router

[9Router](https://9router.com) is a self-hosted, OpenAI-compatible router. Register this provider once and every key becomes a connection under one provider-node:

```bash
node src/connect-9router.js
```

Defaults: `--base http://localhost:20128`, `--password 123456`, `--name "hk.llmxapi.com (一码科技)"`, `--prefix llmxapi`, `--base-url https://hk.llmxapi.com/v1`. Models are then served as `llmxapi/<model id>` and load-balanced across every key.

## 🔌 Connect to OmniRoute

[OmniRoute](https://omniroute.online) is a self-hosted, OpenAI-compatible router. Register this provider once and every key becomes a connection under one provider-node:

```bash
node src/connect-omniroute.js
```

Defaults: `--base http://localhost:20128`, `--password 123456`, `--name "hk.llmxapi.com (一码科技)"`, `--prefix llmxapi`, `--base-url https://hk.llmxapi.com/v1`. Models are then served as `llmxapi/<model id>` and load-balanced across every key.

## 🔑 What one key gets you

| | |
| --- | --- |
| 🏢 Provider | **hk.llmxapi.com (一码科技)** — [hk.llmxapi.com](https://hk.llmxapi.com) |
| 🎁 What the provider gives | one account per key — e-mail code sign-up, every key chat-verified |
| 🔑 What one key gets you | one API key scoped to its own account: the full model ids on the endpoint below, at your plan's limits. The quota lives on the **account**, which is exactly why this tool creates one account per key |
| 🌐 API shape | OpenAI-compatible: `POST https://hk.llmxapi.com/v1/chat/completions` |
| 🔒 Your data | only hk.llmxapi.com and the inbox backend you configure are contacted; keys stay on your machine |

## 🐞 Issues

If the panel changes its signup shape, groups or credit, the tool stops at that step and prints the panel answer verbatim. **[Open an issue](../../issues)** with the command you ran and the exact output; PRs are welcome.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 llmxapi-bulk-apikey contributors

</div>
