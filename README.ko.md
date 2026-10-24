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

**一码科技 (hk.llmxapi.com) 계정을 API 키와 함께 대량 생성 — OpenAI 호환 추론 + 9Router 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-undefined%20served-412991?style=for-the-badge)](https://hk.llmxapi.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-undefined-of-them) · [🧪 API 사용하기](#-how-to-use-the-api) · [✅ 검증됨](#-verified-working--every-key-is-tested) · [🧭 작동 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 이슈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 왜 이 도구가 필요한가

hk.llmxapi.com (一码科技)은 **New API** 패널(`hk.llmxapi.com`)로, 이메일 코드 가입, 비밀번호 등록 개방, 캡차 없음, 그리고 OpenAI 호환 `https://hk.llmxapi.com/v1` 추론을 제공합니다. 유용한 단위는 *키당 계정 하나*이므로, 이 도구는 이를 **모든 줄이 실제 채팅 호출과 `tools` 프로브를 통과한** `keys.txt`로 바꿔 줍니다. 등록 크레딧은 적어서 키 하나는 대략 짧은 세션 한 번의 가치가 있습니다. 충전할 수 있는 출석 체크는 없습니다.

## 🎁 무료 티어 — 얼마나 받을 수 있나

| 항목 | 값 |
| --- | --- |
| 가입 크레딧 | ~100 000 할당량 ≈ **$0.20** (`quota_per_unit` 500 000) |
| 일일 출석 체크 | **없음** (`checkin_enabled=false`) |
| 카드 필요 | **아니오** |
| 캡차 | **꺼짐** (`turnstile_check=false`) |
| 이메일 | 코드, 점 없는 gmail 통과 |

카드도, 캡차도 없습니다: 키 하나의 비용은 패널이 받아들이는 주소 하나입니다.

> 💡 무료 티어는 hk.llmxapi.com (一码科技)이 정하며 변경될 수 있습니다. 실시간 수치는 [hk.llmxapi.com](https://hk.llmxapi.com)에서 확인하세요 — 그리고 도구 자체의 게이트가 판단하게 하세요:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 모델 — undefined개 전부

카탈로그는 토큰 그룹별로 제공됩니다. 실시간 검증된 id: `deepseek-v4.1-flash`, `deepseek-v4-flash`. `deepseek-v4.1-flash`는 CLI의 기본값이며 이 저장소의 모든 검증에 사용된 모델입니다.

## 🧪 API 사용 방법

베이스 URL은 **`https://hk.llmxapi.com/v1`** 입니다 — OpenAI 호환이므로 OpenAI를 지원하는 무엇이든 작동합니다.

```bash
curl https://hk.llmxapi.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 빠른 시작

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

`keys.txt`는 실제 채팅 완성이 키를 증명한 **뒤에만** 기록됩니다.

### 🖱️ 런처

런처는 프록시 목록, 개수, 모델을 묻고 이를 `launcher.config.json`에 기억한 뒤, 올바른 플래그로 CLI를 실행합니다.

## ✅ 검증된 작동 — 모든 키가 테스트됨

| 검사 | 결과 |
| --- | --- |
| 키로 `https://hk.llmxapi.com/v1/models` | **200** — 실제 카탈로그 |
| 키당 두 번의 실제 `POST /chat/completions` 호출 | **200**, 비어 있지 않은 콘텐츠 |
| `tools` — `get_time` 도구 호출 하나, `tool_choice: auto` | **get_time tool_call 반환됨** |
| 이번 실행 (`preadd-gate.js --pool`, fail-closed 종료) | **10 live / 34 keys tried** (24 dead) |
| 채팅 검사를 통과하지 못한 키 | `keys.txt`에 절대 기록되지 않음 |

> **품질 게이트.** 여기 있는 모든 키는 `keys.txt`에 기록되기 전에 실제 `chat-200`을 통과했습니다
> (죽은 키는 절대 배포되지 않습니다). 라우터 조합도 모델 수준에서 같은 규칙을 따릅니다: 항목은
> **모델이 `chat-200`에 응답하고 도구를 호출할 수 있을 때만** 추가됩니다 — 도구 지원이 없는 모델,
> 죽은 키, 죽은 제공자는 추가되지 않고 제거됩니다. 검증 단계는 언제든 다시 실행할 수 있으며,
> 실패는 보고되며 절대 숨겨지지 않습니다.

## 🧭 작동 방식

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: hk.llmxapi.com (一码科技) page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://hk.llmxapi.com/v1/chat/completions → real content = the key is live
```

| 단계 | 호출 | 비고 |
| --- | --- | --- |
| 코드 | `GET /api/verification?email=<addr>` | 패널이 허용 목록 판정을 그대로 응답 |
| 가입 | `POST /api/user/register` | Turnstile이 꺼져 있음; 6자리 코드가 메일로 옴 |
| 로그인 | `POST /api/user/login` | `data.access_token` (JWT) — 이 포크는 세션 쿠키를 **사용하지 않음** |
| 크레딧 | `POST /api/user/checkin` | 매일, 무료 |
| 토큰 | `POST /api/token/` with `{"group":"default"}` | 서빙 그룹 밖의 토큰은 403 응답 |
| 키 | `POST /api/token/<id>/key` | 목록은 키를 마스킹하지만, 공개 엔드포인트는 그렇지 않음 |
| 검사 | `POST /v1/chat/completions` and a `tools` call | `keys.txt` 전에 실제 200 + tool_call 필요 |

## ⚙️ CLI 옵션

```bash
node src/cli.js --count N            # mint N accounts (default 1)
node src/cli.js --revive             # re-login accounts.jsonl, check in, mint a fresh key
node src/cli.js --verify             # re-check every key in keys.txt
node src/cli.js --pool proxies.txt   # rotate exits, one exit per account
node src/cli.js --connect-9router    # register the provider on a local 9Router
node src/cli.js --help
```

| 환경 변수 | 기본값 | 의미 |
| --- | --- | --- |
| `LLMXAPI_BASE` | `https://hk.llmxapi.com` | 패널 베이스 URL |
| `LLMXAPI_PROXIES` | – | 선택적 풀 파일, 줄당 출구 하나 |

## 🛰️ 프록시 뒤에서

**선택 사항, 대규모에서는 권장** (IP별 속도 제한 및 차단). 줄당 출구 하나(`http://`, `https://` CONNECT 또는 `socks5://`)로 `--pool <file>`을 전달하세요; 모든 계정이 다음 출구를 사용하며, 죽은 줄은 해당 시도만 실패시킵니다. 풀이 없으면 도구는 직접 연결합니다.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 줄당 실제 검증된 키 하나 — git-ignored |
| `accounts.jsonl` | 계정별 주소 / 사용자 이름 / 비밀번호 / 키 / 채팅 상태 |
| `proxies.txt` | 출구 목록, 줄당 하나 — git-ignored |

## 🔌 9Router에 연결

[9Router](https://9router.com)는 자체 호스팅, OpenAI 호환 라우터입니다. 이 제공자를 한 번 등록하면 모든 키가 하나의 제공자 노드 아래 연결이 됩니다:

```bash
node src/connect-9router.js
```

기본값: `--base http://localhost:20128`, `--password 123456`, `--name "hk.llmxapi.com (一码科技)"`, `--prefix llmxapi`, `--base-url https://hk.llmxapi.com/v1`. 그러면 모델은 `llmxapi/<model id>`로 제공되며 모든 키에 걸쳐 로드 밸런싱됩니다.

## 🔌 OmniRoute에 연결

[OmniRoute](https://omniroute.online)는 자체 호스팅, OpenAI 호환 라우터입니다. 이 제공자를 한 번 등록하면 모든 키가 하나의 제공자 노드 아래 연결이 됩니다:

```bash
node src/connect-omniroute.js
```

기본값: `--base http://localhost:20128`, `--password 123456`, `--name "hk.llmxapi.com (一码科技)"`, `--prefix llmxapi`, `--base-url https://hk.llmxapi.com/v1`. 그러면 모델은 `llmxapi/<model id>`로 제공되며 모든 키에 걸쳐 로드 밸런싱됩니다.

## 🔑 키 하나로 얻는 것

| | |
| --- | --- |
| 🏢 제공자 | **hk.llmxapi.com (一码科技)** — [hk.llmxapi.com](https://hk.llmxapi.com) |
| 🎁 제공자가 주는 것 | 키당 계정 하나 — 이메일 코드 가입, 모든 키 채팅 검증됨 |
| 🔑 키 하나로 얻는 것 | 자체 계정에 한정된 API 키 하나: 아래 엔드포인트의 전체 모델 id, 요금제 한도 내에서. 할당량은 **계정**에 있으므로, 이 도구가 키당 계정 하나를 생성하는 것입니다 |
| 🌐 API 형태 | OpenAI 호환: `POST https://hk.llmxapi.com/v1/chat/completions` |
| 🔒 데이터 | hk.llmxapi.com과 설정한 inbox 백엔드만 접속됩니다; 키는 사용자 컴퓨터에 남습니다 |

## 🐞 이슈

패널이 가입 형태, 그룹 또는 크레딧을 변경하면, 도구는 해당 단계에서 멈추고 패널 응답을 그대로 출력합니다. 실행한 명령과 정확한 출력을 포함해 **[이슈를 열어주세요](../../issues)**; PR을 환영합니다.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참조.

<div align="center">

**[MIT](LICENSE)** © 2026 llmxapi-bulk-apikey contributors

</div>