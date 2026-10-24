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

**批量创建一码科技 (hk.llmxapi.com) 账户及其 API 密钥 — 兼容 OpenAI 的推理 + 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-undefined%20served-412991?style=for-the-badge)](https://hk.llmxapi.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-undefined-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题反馈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 为什么有这个项目

hk.llmxapi.com (一码科技) 是一个 **New API** 面板 (`hk.llmxapi.com`)，支持邮箱验证码注册、密码注册开放、无验证码，并提供兼容 OpenAI 的 `https://hk.llmxapi.com/v1` 推理服务。有用的单位是*每个密钥对应一个账户*，因此本工具将其转化为一个 `keys.txt`，其中**每一行都通过了一次真实的聊天调用**和一次 `tools` 探测。注册赠送的额度很小，所以一个密钥大约只够一次短会话；没有签到可以补充额度。

## 🎁 免费额度 — 你能获得多少

| 项目 | 值 |
| --- | --- |
| 注册赠送额度 | ~100 000 配额 ≈ **$0.20** (`quota_per_unit` 500 000) |
| 每日签到 | **无** (`checkin_enabled=false`) |
| 需要银行卡 | **否** |
| 验证码 | **关闭** (`turnstile_check=false`) |
| 邮箱 | 验证码，无点 gmail 可通过 |

无需银行卡，无需验证码：一个密钥只需一个面板接受的邮箱地址。

> 💡 免费额度由 hk.llmxapi.com (一码科技) 设定，可能会变化。请在 [hk.llmxapi.com](https://hk.llmxapi.com) 查看实时数据 — 并让工具自身的关卡来决定：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 模型 — 全部 undefined 个

模型目录按令牌分组提供。已验证的实时 id：`deepseek-v4.1-flash`、`deepseek-v4-flash`。`deepseek-v4.1-flash` 是 CLI 的默认模型，也是本仓库中所有验证所使用的模型。

## 🧪 如何使用 API

基础 URL 是 **`https://hk.llmxapi.com/v1`** — 兼容 OpenAI，因此任何支持 OpenAI 的工具都可以使用。

```bash
curl https://hk.llmxapi.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 快速开始

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

`keys.txt` **仅在**一次实时聊天补全证明密钥有效后才会写入。

### 🖱️ 启动器

启动器会询问代理列表、数量和模型，将它们记录在 `launcher.config.json` 中，并使用正确的标志运行 CLI。

## ✅ 已验证可用 — 每个密钥都经过测试

| 检查 | 结果 |
| --- | --- |
| 使用密钥访问 `https://hk.llmxapi.com/v1/models` | **200** — 真实目录 |
| 每个密钥两次实时 `POST /chat/completions` 调用 | **200**，内容非空 |
| `tools` — 一次 `get_time` 工具调用，`tool_choice: auto` | **返回 get_time tool_call** |
| 本次运行 (`preadd-gate.js --pool`，失败即退出) | **10 个有效 / 尝试 34 个密钥** (24 个失效) |
| 未通过聊天检查的密钥 | 从不写入 `keys.txt` |

> **质量关卡。** 这里的每个密钥在写入 `keys.txt` 之前都通过了实时 `chat-200`
> (失效密钥从不发布)。路由组合在模型层面遵循同样的规则：一个条目**仅当模型能返回 `chat-200` 且能调用工具时**才会被添加 — 不支持工具的模型、失效的密钥或失效的提供者会被丢弃而不是添加。随时重新运行验证步骤；失败会被报告，从不隐藏。

## 🧭 工作原理

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: hk.llmxapi.com (一码科技) page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://hk.llmxapi.com/v1/chat/completions → real content = the key is live
```

| 步骤 | 调用 | 备注 |
| --- | --- | --- |
| 验证码 | `GET /api/verification?email=<addr>` | 面板原样返回允许列表判定 |
| 注册 | `POST /api/user/register` | Turnstile 已关闭；6 位验证码通过邮件发送 |
| 登录 | `POST /api/user/login` | `data.access_token` (JWT) — 此分支**不**使用会话 cookie |
| 额度 | `POST /api/user/checkin` | 每日，免费 |
| 令牌 | `POST /api/token/` 带 `{"group":"default"}` | 不在服务分组中的令牌返回 403 |
| 密钥 | `POST /api/token/<id>/key` | 列表会隐藏密钥，而揭示端点不会 |
| 检查 | `POST /v1/chat/completions` 和一次 `tools` 调用 | 需要实时 200 + tool_call 才能写入 `keys.txt` |

## ⚙️ CLI 选项

```bash
node src/cli.js --count N            # mint N accounts (default 1)
node src/cli.js --revive             # re-login accounts.jsonl, check in, mint a fresh key
node src/cli.js --verify             # re-check every key in keys.txt
node src/cli.js --pool proxies.txt   # rotate exits, one exit per account
node src/cli.js --connect-9router    # register the provider on a local 9Router
node src/cli.js --help
```

| 环境变量 | 默认值 | 含义 |
| --- | --- | --- |
| `LLMXAPI_BASE` | `https://hk.llmxapi.com` | 面板基础 URL |
| `LLMXAPI_PROXIES` | – | 可选的代理池文件，每行一个出口 |

## 🛰️ 使用代理

**可选，大规模使用时推荐** (针对每 IP 的速率限制和封禁)。传入 `--pool <file>`，每行一个出口 (`http://`、`https://` CONNECT 或 `socks5://`)；每个账户使用下一个出口，失效的线路只会导致该次尝试失败。没有代理池时，工具直接连接。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个经过实时验证的密钥 — 已被 git 忽略 |
| `accounts.jsonl` | 每个账户的邮箱 / 用户名 / 密码 / 密钥 / 聊天状态 |
| `proxies.txt` | 你的出口，每行一个 — 已被 git 忽略 |

## 🔌 连接到 9Router

[9Router](https://9router.com) 是一个自托管、兼容 OpenAI 的路由器。注册此提供者一次，每个密钥都会成为一个提供者节点下的连接：

```bash
node src/connect-9router.js
```

默认值：`--base http://localhost:20128`、`--password 123456`、`--name "hk.llmxapi.com (一码科技)"`、`--prefix llmxapi`、`--base-url https://hk.llmxapi.com/v1`。模型随后以 `llmxapi/<model id>` 的形式提供，并在所有密钥之间进行负载均衡。

## 🔌 连接到 OmniRoute

[OmniRoute](https://omniroute.online) 是一个自托管、兼容 OpenAI 的路由器。注册此提供者一次，每个密钥都会成为一个提供者节点下的连接：

```bash
node src/connect-omniroute.js
```

默认值：`--base http://localhost:20128`、`--password 123456`、`--name "hk.llmxapi.com (一码科技)"`、`--prefix llmxapi`、`--base-url https://hk.llmxapi.com/v1`。模型随后以 `llmxapi/<model id>` 的形式提供，并在所有密钥之间进行负载均衡。

## 🔑 一个密钥能给你什么

| | |
| --- | --- |
| 🏢 提供者 | **hk.llmxapi.com (一码科技)** — [hk.llmxapi.com](https://hk.llmxapi.com) |
| 🎁 提供者给予什么 | 每个密钥对应一个账户 — 邮箱验证码注册，每个密钥都经过聊天验证 |
| 🔑 一个密钥能给你什么 | 一个作用域为其自身账户的 API 密钥：下方端点上的完整模型 id，受你套餐限制。配额存在于**账户**上，这正是本工具为每个密钥创建一个账户的原因 |
| 🌐 API 形态 | 兼容 OpenAI：`POST https://hk.llmxapi.com/v1/chat/completions` |
| 🔒 你的数据 | 仅联系 hk.llmxapi.com 和你配置的收件箱后端；密钥保留在你的机器上 |

## 🐞 问题反馈

如果面板更改了其注册形态、分组或额度，工具会在该步骤停止并原样打印面板的回复。请**[提交 issue](../../issues)**，附上你运行的命令和确切的输出；欢迎 PR。

## 📄 许可证

MIT © 2026 — 参见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 llmxapi-bulk-apikey contributors

</div>