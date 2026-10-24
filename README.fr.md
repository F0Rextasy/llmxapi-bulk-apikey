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

**Créer en masse des comptes 一码科技 (hk.llmxapi.com) avec des clés API — inférence compatible OpenAI + connecteur 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-undefined%20served-412991?style=for-the-badge)](https://hk.llmxapi.com)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Offre gratuite](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-undefined-of-them) · [🧪 Utiliser l'API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Comment ça marche](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Pourquoi cet outil existe

hk.llmxapi.com (一码科技) est un panneau **New API** (`hk.llmxapi.com`) avec inscription par code e-mail, inscription par mot de passe ouverte, pas de captcha et inférence compatible OpenAI sur `https://hk.llmxapi.com/v1`. L'unité utile est *un compte par clé*, donc cet outil transforme cela en un `keys.txt` où **chaque ligne a survécu à un véritable appel de chat** et à une sonde `tools`. Le crédit d'inscription est faible, donc une clé vaut environ une courte session ; il n'y a pas de check-in pour le recharger.

## 🎁 Offre gratuite — ce que vous obtenez

| Quoi | Valeur |
| --- | --- |
| Crédit d'inscription | ~100 000 quota ≈ **0,20 $** (`quota_per_unit` 500 000) |
| Check-in quotidien | **Non** (`checkin_enabled=false`) |
| Carte requise | **Non** |
| Captcha | **Désactivé** (`turnstile_check=false`) |
| E-mail | code, les gmail sans point passent |

Pas de carte, pas de captcha : une clé coûte une adresse que le panneau accepte.

> 💡 L'offre gratuite est définie par hk.llmxapi.com (一码科技) et peut changer. Consultez les chiffres en direct sur [hk.llmxapi.com](https://hk.llmxapi.com) — et laissez la propre barrière de l'outil décider :

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modèles — tous les undefined d'entre eux

Le catalogue est servi par groupe de jetons. Identifiants vérifiés en direct : `deepseek-v4.1-flash`, `deepseek-v4-flash`. `deepseek-v4.1-flash` est le modèle par défaut du CLI et le modèle utilisé pour chaque vérification dans ce dépôt.

## 🧪 Comment utiliser l'API

L'URL de base est **`https://hk.llmxapi.com/v1`** — compatible OpenAI, donc tout ce qui parle OpenAI fonctionne.

```bash
curl https://hk.llmxapi.com/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4.1-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🛠 Démarrage rapide

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

`keys.txt` n'est écrit **qu'**après qu'un chat completion en direct a prouvé la clé.

### 🖱️ Le lanceur

Le lanceur demande la liste de proxies, le nombre et le modèle, les mémorise dans `launcher.config.json`, et exécute le CLI avec les bons drapeaux.

## ✅ Vérifié fonctionnel — chaque clé est testée

| Vérification | Résultat |
| --- | --- |
| `https://hk.llmxapi.com/v1/models` avec la clé | **200** — vrai catalogue |
| deux appels `POST /chat/completions` en direct par clé | **200**, contenu non vide |
| `tools` — un appel d'outil `get_time`, `tool_choice: auto` | **get_time tool_call returned** |
| cette exécution (`preadd-gate.js --pool`, sorties fail-closed) | **10 live / 34 keys tried** (24 dead) |
| une clé qui échoue au contrôle de chat | jamais écrite dans `keys.txt` |

> **Barrières de qualité.** Chaque clé ici a passé un `chat-200` en direct avant d'être écrite dans `keys.txt`
> (les clés mortes ne sont jamais livrées). Les combinaisons de routeur suivent la même règle au niveau du modèle : une entrée est
> ajoutée **uniquement si le modèle répond `chat-200` et peut appeler des outils** — un modèle sans support des outils,
> une clé morte ou un fournisseur mort est écarté au lieu d'être ajouté. Relancez l'étape de vérification à tout moment ;
> les échecs sont signalés, jamais cachés.

## 🧭 Comment ça marche

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: hk.llmxapi.com (一码科技) page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://hk.llmxapi.com/v1/chat/completions → real content = the key is live
```

| Étape | Appel | Notes |
| --- | --- | --- |
| code | `GET /api/verification?email=<addr>` | le panneau répond mot pour mot au verdict de la liste d'autorisation |
| inscription | `POST /api/user/register` | Turnstile est désactivé ; un code de 6 caractères arrive par e-mail |
| connexion | `POST /api/user/login` | `data.access_token` (JWT) — ce fork n'utilise **pas** de cookie de session |
| crédit | `POST /api/user/checkin` | quotidien, gratuit |
| jeton | `POST /api/token/` avec `{"group":"default"}` | un jeton hors d'un groupe de service répond 403 |
| clé | `POST /api/token/<id>/key` | la liste masque la clé, le point de terminaison de révélation non |
| contrôle | `POST /v1/chat/completions` et un appel `tools` | 200 en direct + tool_call requis avant `keys.txt` |

## ⚙️ Options du CLI

```bash
node src/cli.js --count N            # mint N accounts (default 1)
node src/cli.js --revive             # re-login accounts.jsonl, check in, mint a fresh key
node src/cli.js --verify             # re-check every key in keys.txt
node src/cli.js --pool proxies.txt   # rotate exits, one exit per account
node src/cli.js --connect-9router    # register the provider on a local 9Router
node src/cli.js --help
```

| Variable d'environnement | Défaut | Signification |
| --- | --- | --- |
| `LLMXAPI_BASE` | `https://hk.llmxapi.com` | URL de base du panneau |
| `LLMXAPI_PROXIES` | – | fichier de pool optionnel, une sortie par ligne |

## 🛰️ Derrière un proxy

**Optionnel, recommandé à grande échelle** (limites de débit et bannissements par IP). Passez `--pool <file>` avec une sortie par ligne (`http://`, `https://` CONNECT ou `socks5://`) ; chaque compte utilise la sortie suivante, et une ligne morte ne fait échouer que cette tentative. Sans pool, l'outil se connecte directement.

## 📄 Fichiers

| Chemin | Contenu |
| --- | --- |
| `keys.txt` | une clé vérifiée en direct par ligne — ignoré par git |
| `accounts.jsonl` | adresse / nom d'utilisateur / mot de passe / clé / statut de chat par compte |
| `proxies.txt` | vos sorties, une par ligne — ignoré par git |

## 🔌 Connexion à 9Router

[9Router](https://9router.com) est un routeur auto-hébergé compatible OpenAI. Enregistrez ce fournisseur une fois et chaque clé devient une connexion sous un nœud fournisseur :

```bash
node src/connect-9router.js
```

Défauts : `--base http://localhost:20128`, `--password 123456`, `--name "hk.llmxapi.com (一码科技)"`, `--prefix llmxapi`, `--base-url https://hk.llmxapi.com/v1`. Les modèles sont alors servis comme `llmxapi/<model id>` et répartis sur chaque clé.

## 🔌 Connexion à OmniRoute

[OmniRoute](https://omniroute.online) est un routeur auto-hébergé compatible OpenAI. Enregistrez ce fournisseur une fois et chaque clé devient une connexion sous un nœud fournisseur :

```bash
node src/connect-omniroute.js
```

Défauts : `--base http://localhost:20128`, `--password 123456`, `--name "hk.llmxapi.com (一码科技)"`, `--prefix llmxapi`, `--base-url https://hk.llmxapi.com/v1`. Les modèles sont alors servis comme `llmxapi/<model id>` et répartis sur chaque clé.

## 🔑 Ce qu'une clé vous apporte

| | |
| --- | --- |
| 🏢 Fournisseur | **hk.llmxapi.com (一码科技)** — [hk.llmxapi.com](https://hk.llmxapi.com) |
| 🎁 Ce que le fournisseur donne | un compte par clé — inscription par code e-mail, chaque clé vérifiée par chat |
| 🔑 Ce qu'une clé vous apporte | une clé API limitée à son propre compte : les identifiants complets des modèles sur le point de terminaison ci-dessous, aux limites de votre offre. Le quota vit sur le **compte**, ce qui est exactement pourquoi cet outil crée un compte par clé |
| 🌐 Forme de l'API | compatible OpenAI : `POST https://hk.llmxapi.com/v1/chat/completions` |
| 🔒 Vos données | seuls hk.llmxapi.com et le backend de boîte de réception que vous configurez sont contactés ; les clés restent sur votre machine |

## 🐞 Problèmes

Si le panneau change la forme de son inscription, ses groupes ou son crédit, l'outil s'arrête à cette étape et imprime la réponse du panneau mot pour mot. **[Ouvrez un ticket](../../issues)** avec la commande que vous avez exécutée et la sortie exacte ; les PR sont bienvenues.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 llmxapi-bulk-apikey contributors

</div>