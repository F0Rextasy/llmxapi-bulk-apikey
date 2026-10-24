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

**Массовое создание аккаунтов 一码科技 (hk.llmxapi.com) с API-ключами — OpenAI-совместимый инференс + коннектор 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-undefined%20served-412991?style=for-the-badge)](https://hk.llmxapi.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-undefined-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Зачем это нужно

hk.llmxapi.com (一码科技) — это панель **New API** (`hk.llmxapi.com`) с регистрацией по коду из письма, открытой регистрацией по паролю, без капчи и с OpenAI-совместимым инференсом на `https://hk.llmxapi.com/v1`. Полезная единица — *один аккаунт на ключ*, поэтому этот инструмент превращает это в `keys.txt`, где **каждая строка прошла реальный вызов чата** и проверку `tools`. Начисляемый кредит небольшой, поэтому ключа хватает примерно на одну короткую сессию; ежедневной отметки для его пополнения нет.

## 🎁 Бесплатный тариф — сколько вы получаете

| Что | Значение |
| --- | --- |
| Кредит при регистрации | ~100 000 квоты ≈ **$0.20** (`quota_per_unit` 500 000) |
| Ежедневная отметка | **Нет** (`checkin_enabled=false`) |
| Требуется карта | **Нет** |
| Капча | **Отключена** (`turnstile_check=false`) |
| Эл. почта | код, проходит gmail без точек |

Ни карты, ни капчи: ключ стоит один адрес, который принимает панель.

> 💡 Бесплатный тариф задаётся hk.llmxapi.com (一码科技) и может измениться. Проверяйте актуальные цифры на [hk.llmxapi.com](https://hk.llmxapi.com) — и пусть решает собственный фильтр инструмента:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Модели — все undefined из них

Каталог выдаётся по группе токена. Проверенные живые id: `deepseek-v4.1-flash`, `deepseek-v4-flash`. `deepseek-v4.1-flash` — это модель по умолчанию в CLI и модель, используемая для каждой проверки в этом репозитории.

## 🧪 Как использовать API

Базовый URL — **`https://hk.llmxapi.com/v1`** — OpenAI-совместимый, поэтому работает всё, что говорит на языке OpenAI.

```bash
curl https://hk.llmxapi.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 Быстрый старт

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

`keys.txt` записывается **только** после того, как живое завершение чата подтвердит ключ.

### 🖱️ Лаунчер

Лаунчер запрашивает список прокси, количество и модель, запоминает их в `launcher.config.json` и запускает CLI с нужными флагами.

## ✅ Проверено в работе — каждый ключ протестирован

| Проверка | Результат |
| --- | --- |
| `https://hk.llmxapi.com/v1/models` с ключом | **200** — реальный каталог |
| два живых вызова `POST /chat/completions` на ключ | **200**, непустое содержимое |
| `tools` — один вызов инструмента `get_time`, `tool_choice: auto` | **get_time tool_call returned** |
| этот запуск (`preadd-gate.js --pool`, fail-closed exits) | **10 live / 34 keys tried** (24 dead) |
| ключ, не прошедший проверку чата | никогда не записывается в `keys.txt` |

> **Фильтры качества.** Каждый ключ здесь прошёл живой `chat-200` до того, как был записан в `keys.txt`
> (мёртвые ключи никогда не поставляются). Комбинации роутера следуют тому же правилу на уровне модели: запись
> добавляется **только если модель отвечает `chat-200` и умеет вызывать инструменты** — модель без поддержки инструментов,
> мёртвый ключ или мёртвый провайдер отбрасывается, а не добавляется. Перезапускайте шаг проверки в любое время;
> сбои сообщаются, а не скрываются.

## 🧭 Как это работает

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: hk.llmxapi.com (一码科技) page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://hk.llmxapi.com/v1/chat/completions → real content = the key is live
```

| Шаг | Вызов | Примечания |
| --- | --- | --- |
| код | `GET /api/verification?email=<addr>` | панель дословно возвращает вердикт по allow-list |
| регистрация | `POST /api/user/register` | Turnstile отключён; 6-символьный код приходит по почте |
| вход | `POST /api/user/login` | `data.access_token` (JWT) — этот форк **не** использует сессионную cookie |
| кредит | `POST /api/user/checkin` | ежедневно, бесплатно |
| токен | `POST /api/token/` с `{"group":"default"}` | токен вне обслуживающей группы отвечает 403 |
| ключ | `POST /api/token/<id>/key` | список маскирует ключ, а endpoint раскрытия — нет |
| проверка | `POST /v1/chat/completions` и вызов `tools` | требуется живой 200 + tool_call до `keys.txt` |

## ⚙️ Опции CLI

```bash
node src/cli.js --count N            # mint N accounts (default 1)
node src/cli.js --revive             # re-login accounts.jsonl, check in, mint a fresh key
node src/cli.js --verify             # re-check every key in keys.txt
node src/cli.js --pool proxies.txt   # rotate exits, one exit per account
node src/cli.js --connect-9router    # register the provider on a local 9Router
node src/cli.js --help
```

| Переменная окружения | По умолчанию | Значение |
| --- | --- | --- |
| `LLMXAPI_BASE` | `https://hk.llmxapi.com` | базовый URL панели |
| `LLMXAPI_PROXIES` | – | необязательный файл пула, по одному выходу на строку |

## 🛰️ За прокси

**Необязательно, рекомендуется при масштабе** (лимиты и баны по IP). Передайте `--pool <file>` с одним выходом на строку (`http://`, `https://` CONNECT или `socks5://`); каждый аккаунт использует следующий выход, а мёртвая строка приводит к сбою только этой попытки. Без пула инструмент подключается напрямую.

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | один проверенный в работе ключ на строку — игнорируется git |
| `accounts.jsonl` | адрес / имя пользователя / пароль / ключ / статус чата для каждого аккаунта |
| `proxies.txt` | ваши выходы, по одному на строку — игнорируется git |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — это самостоятельно размещаемый OpenAI-совместимый роутер. Зарегистрируйте этого провайдера один раз, и каждый ключ станет соединением под одним узлом провайдера:

```bash
node src/connect-9router.js
```

По умолчанию: `--base http://localhost:20128`, `--password 123456`, `--name "hk.llmxapi.com (一码科技)"`, `--prefix llmxapi`, `--base-url https://hk.llmxapi.com/v1`. Затем модели обслуживаются как `llmxapi/<model id>` и балансируются между всеми ключами.

## 🔌 Подключение к OmniRoute

[OmniRoute](https://omniroute.online) — это самостоятельно размещаемый OpenAI-совместимый роутер. Зарегистрируйте этого провайдера один раз, и каждый ключ станет соединением под одним узлом провайдера:

```bash
node src/connect-omniroute.js
```

По умолчанию: `--base http://localhost:20128`, `--password 123456`, `--name "hk.llmxapi.com (一码科技)"`, `--prefix llmxapi`, `--base-url https://hk.llmxapi.com/v1`. Затем модели обслуживаются как `llmxapi/<model id>` и балансируются между всеми ключами.

## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **hk.llmxapi.com (一码科技)** — [hk.llmxapi.com](https://hk.llmxapi.com) |
| 🎁 Что даёт провайдер | один аккаунт на ключ — регистрация по коду из письма, каждый ключ проверен чатом |
| 🔑 Что даёт один ключ | один API-ключ, привязанный к своему аккаунту: полные id моделей на endpoint ниже, в пределах лимитов вашего тарифа. Квота живёт на **аккаунте**, и именно поэтому этот инструмент создаёт один аккаунт на ключ |
| 🌐 Форма API | OpenAI-совместимая: `POST https://hk.llmxapi.com/v1/chat/completions` |
| 🔒 Ваши данные | связь только с hk.llmxapi.com и настроенным вами бэкендом inbox; ключи остаются на вашей машине |

## 🐞 Проблемы

Если панель изменит форму регистрации, группы или кредит, инструмент останавливается на этом шаге и дословно печатает ответ панели. **[Откройте issue](../../issues)** с командой, которую вы запустили, и точным выводом; PR приветствуются.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 llmxapi-bulk-apikey contributors

</div>