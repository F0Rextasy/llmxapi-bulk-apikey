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

**Crea cuentas en masa de 一码科技 (hk.llmxapi.com) con claves API — inferencia compatible con OpenAI + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-undefined%20served-412991?style=for-the-badge)](https://hk.llmxapi.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-undefined-of-them) · [🧪 Usa la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por qué existe esto

hk.llmxapi.com (一码科技) es un panel **New API** (`hk.llmxapi.com`) con registro por código de correo electrónico, registro con contraseña abierto, sin captcha e inferencia compatible con OpenAI en `https://hk.llmxapi.com/v1`. La unidad útil es *una cuenta por clave*, así que esta herramienta lo convierte en un `keys.txt` donde **cada línea sobrevivió a una llamada de chat real** y a una prueba de `tools`. El crédito registrado es pequeño, así que una clave vale aproximadamente una sesión corta; no hay check-in para recargarlo.

## 🎁 Nivel gratuito — cuánto obtienes

| Qué | Valor |
| --- | --- |
| Crédito de registro | ~100 000 de cuota ≈ **$0.20** (`quota_per_unit` 500 000) |
| Check-in diario | **No** (`checkin_enabled=false`) |
| Tarjeta requerida | **No** |
| Captcha | **Desactivado** (`turnstile_check=false`) |
| Correo electrónico | código, gmail sin puntos pasa |

Sin tarjeta, sin captcha: una clave cuesta una dirección que el panel acepte.

> 💡 El nivel gratuito lo define hk.llmxapi.com (一码科技) y puede cambiar. Consulta los números en vivo en [hk.llmxapi.com](https://hk.llmxapi.com) — y deja que la propia puerta de la herramienta decida:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — todos los undefined de ellos

El catálogo se sirve por grupo de tokens. Ids verificados en vivo: `deepseek-v4.1-flash`, `deepseek-v4-flash`. `deepseek-v4.1-flash` es el predeterminado del CLI y el modelo usado para cada verificación en este repositorio.

## 🧪 Cómo usar la API

La URL base es **`https://hk.llmxapi.com/v1`** — compatible con OpenAI, así que cualquier cosa que hable OpenAI funciona.

```bash
curl https://hk.llmxapi.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 Inicio rápido

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

`keys.txt` se escribe **solo** después de que una finalización de chat en vivo demuestre que la clave funciona.

### 🖱️ El lanzador

El lanzador pide la lista de proxies, la cantidad y el modelo, los recuerda en `launcher.config.json` y ejecuta el CLI con las banderas correctas.

## ✅ Verificado funcionando — cada clave se prueba

| Comprobación | Resultado |
| --- | --- |
| `https://hk.llmxapi.com/v1/models` con la clave | **200** — catálogo real |
| dos llamadas en vivo a `POST /chat/completions` por clave | **200**, contenido no vacío |
| `tools` — una llamada de herramienta `get_time`, `tool_choice: auto` | **get_time tool_call devuelto** |
| esta ejecución (`preadd-gate.js --pool`, salidas fail-closed) | **10 en vivo / 34 claves probadas** (24 muertas) |
| una clave que falla la comprobación de chat | nunca se escribe en `keys.txt` |

> **Puertas de calidad.** Cada clave aquí pasó un `chat-200` en vivo antes de escribirse en `keys.txt`
> (las claves muertas nunca se entregan). Las combinaciones del router siguen la misma regla a nivel de modelo: una entrada se
> añade **solo si el modelo responde `chat-200` y puede llamar herramientas** — un modelo sin soporte de herramientas,
> una clave muerta o un proveedor muerto se descarta en lugar de añadirse. Vuelve a ejecutar el paso de verificación cuando quieras;
> los fallos se reportan, nunca se ocultan.

## 🧭 Cómo funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: hk.llmxapi.com (一码科技) page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://hk.llmxapi.com/v1/chat/completions → real content = the key is live
```

| Paso | Llamada | Notas |
| --- | --- | --- |
| código | `GET /api/verification?email=<addr>` | el panel responde el veredicto de la lista de permitidos textualmente |
| registro | `POST /api/user/register` | Turnstile está desactivado; un código de 6 caracteres llega por correo |
| inicio de sesión | `POST /api/user/login` | `data.access_token` (JWT) — este fork **no** usa una cookie de sesión |
| crédito | `POST /api/user/checkin` | diario, gratis |
| token | `POST /api/token/` con `{"group":"default"}` | un token fuera de un grupo de servicio responde 403 |
| clave | `POST /api/token/<id>/key` | la lista enmascara la clave, el endpoint de revelado no |
| comprobación | `POST /v1/chat/completions` y una llamada `tools` | 200 en vivo + tool_call requeridos antes de `keys.txt` |

## ⚙️ Opciones del CLI

```bash
node src/cli.js --count N            # mint N accounts (default 1)
node src/cli.js --revive             # re-login accounts.jsonl, check in, mint a fresh key
node src/cli.js --verify             # re-check every key in keys.txt
node src/cli.js --pool proxies.txt   # rotate exits, one exit per account
node src/cli.js --connect-9router    # register the provider on a local 9Router
node src/cli.js --help
```

| Variable de entorno | Predeterminado | Significado |
| --- | --- | --- |
| `LLMXAPI_BASE` | `https://hk.llmxapi.com` | URL base del panel |
| `LLMXAPI_PROXIES` | – | archivo de pool opcional, una salida por línea |

## 🛰️ Detrás de un proxy

**Opcional, recomendado a escala** (límites de tasa y bloqueos por IP). Pasa `--pool <file>` con una salida por línea (`http://`, `https://` CONNECT o `socks5://`); cada cuenta usa la siguiente salida, y una línea muerta solo hace fallar ese intento. Sin un pool, la herramienta se conecta directamente.

## 📄 Archivos

| Ruta | Contenido |
| --- | --- |
| `keys.txt` | una clave verificada en vivo por línea — ignorada por git |
| `accounts.jsonl` | dirección / nombre de usuario / contraseña / clave / estado de chat por cuenta |
| `proxies.txt` | tus salidas, una por línea — ignorada por git |

## 🔌 Conectar con 9Router

[9Router](https://9router.com) es un router autoalojado y compatible con OpenAI. Registra este proveedor una vez y cada clave se convierte en una conexión bajo un nodo de proveedor:

```bash
node src/connect-9router.js
```

Predeterminados: `--base http://localhost:20128`, `--password 123456`, `--name "hk.llmxapi.com (一码科技)"`, `--prefix llmxapi`, `--base-url https://hk.llmxapi.com/v1`. Los modelos se sirven entonces como `llmxapi/<model id>` y se balancean entre todas las claves.

## 🔌 Conectar con OmniRoute

[OmniRoute](https://omniroute.online) es un router autoalojado y compatible con OpenAI. Registra este proveedor una vez y cada clave se convierte en una conexión bajo un nodo de proveedor:

```bash
node src/connect-omniroute.js
```

Predeterminados: `--base http://localhost:20128`, `--password 123456`, `--name "hk.llmxapi.com (一码科技)"`, `--prefix llmxapi`, `--base-url https://hk.llmxapi.com/v1`. Los modelos se sirven entonces como `llmxapi/<model id>` y se balancean entre todas las claves.

## 🔑 Qué te da una clave

| | |
| --- | --- |
| 🏢 Proveedor | **hk.llmxapi.com (一码科技)** — [hk.llmxapi.com](https://hk.llmxapi.com) |
| 🎁 Qué da el proveedor | una cuenta por clave — registro por código de correo, cada clave verificada por chat |
| 🔑 Qué te da una clave | una clave API limitada a su propia cuenta: los ids de modelo completos en el endpoint de abajo, con los límites de tu plan. La cuota vive en la **cuenta**, que es exactamente por lo que esta herramienta crea una cuenta por clave |
| 🌐 Forma de la API | Compatible con OpenAI: `POST https://hk.llmxapi.com/v1/chat/completions` |
| 🔒 Tus datos | solo se contacta a hk.llmxapi.com y al backend de bandeja de entrada que configures; las claves permanecen en tu máquina |

## 🐞 Problemas

Si el panel cambia la forma de su registro, los grupos o el crédito, la herramienta se detiene en ese paso e imprime la respuesta del panel textualmente. **[Abre un issue](../../issues)** con el comando que ejecutaste y la salida exacta; los PR son bienvenidos.

## 📄 Licencia

MIT © 2026 — consulta [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 llmxapi-bulk-apikey contributors

</div>