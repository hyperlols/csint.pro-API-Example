# csint.pro Node.js API Examples

> Official Node.js examples for the [csint.pro](https://csint.pro) intelligence platform.  
> 59+ endpoints · 20+ data sources · one API key.

---

## What is csint.pro?

csint.pro is a unified OSINT and intelligence platform giving you access to breach databases, social media recon, network analysis, crypto tracing, and AI-powered tools through a single, clean API.

Instead of paying $26,000+/year for individual subscriptions to Snusbase, IntelX, Shodan, SEON, and more, csint.pro aggregates them all under one plan.

---

## Requirements

- Node.js **18+** (uses native `fetch`, no extra dependencies needed)
- A csint.pro API key → [csint.pro/dashboard](https://csint.pro/dashboard)

---

## Setup

```bash
git clone https://github.com/hyperlols/csint.pro-API-example.git
cd csint.pro-API-example

cp .env.example .env
# Edit .env and paste your API key
```

No `npm install` needed. Zero dependencies.

---

## Quick Start

```bash
# Check your API key status and usage
CSINT_API_KEY=your_key node -e "
const C = require('./src/client');
new C(process.env.CSINT_API_KEY).status().then(d => console.log(JSON.stringify(d, null, 2)));
"

# Or use the shortcut
CSINT_API_KEY=your_key npm run status
```

---

## Usage

### Import the client

```js
const CsintClient = require('./src/client');

const client = new CsintClient(process.env.CSINT_API_KEY);
```

### Check account status

```js
const status = await client.status();
console.log(status.usage.remaining_hourly); // requests left this hour
```

---

## Modules & Methods

### In-House (built by csint.pro)

| Method | Description |
|--------|-------------|
| `client.ipLookup(ip)` | Geolocation, ASN, threat score, anonymizer detection |
| `client.discordLookup(userId)` | Profile, servers, messages, IP & email |
| `client.discordOsint(userId)` | IP address and email linked to a Discord ID |
| `client.discordStats()` | Total messages and users in the index |
| `client.cryptoAnalyze(address, crypto)` | Balance, transactions, risk score (BTC/ETH/LTC/DOGE) |
| `client.analyzeEmail(email)` | AI-generated multi-source breach intelligence report |
| `client.geolocateImage(base64)` | AI location estimate from an image |

```js
// IP Lookup
const result = await client.ipLookup('8.8.8.8');
console.log(result.risk.level);       // 'clean'
console.log(result.location.country); // 'United States'
console.log(result.network.asn);      // 'AS15169'

// Discord
const user = await client.discordLookup('123456789123456789');
console.log(user.user.username);
console.log(user.osint_data.ip_address);

// Crypto
const wallet = await client.cryptoAnalyze('1A1zP1...', 'BTC');
console.log(wallet.balance.usd); // current USD value

// AI Email Report
const report = await client.analyzeEmail('target@example.com');
console.log(report.ai_summary); // full structured markdown report
console.log(report.raw_stats.breach_records);

// AI Image Geolocation
const fs = require('fs');
const b64 = fs.readFileSync('./photo.jpg').toString('base64');
const geo = await client.geolocateImage(b64);
console.log(geo.analysis); // location estimate + confidence + reasoning
```

---

### Intelligence X

> Limited to **50 requests/day**. Use wisely.

| Method | Description |
|--------|-------------|
| `client.intelxDownload(systemId)` | Download raw IntelX content by System ID |

```js
const content = await client.intelxDownload('bd372637-0069-4d3f-8c8d-5d354b88671d');
// Returns plain text, not JSON
console.log(content.slice(0, 500));
```

---

### Shodan

| Method | Description |
|--------|-------------|
| `client.shodanHost(ip, history?)` | Full host intelligence for an IP |
| `client.shodanSearch(query, page?)` | Search Shodan with a query string |
| `client.shodanDns(domain)` | DNS lookup for a domain |
| `client.shodanExploits(query)` | Search known exploits |
| `client.shodanHoneyscore(ip)` | Honeypot probability score (0.0–1.0) |

```js
const host = await client.shodanHost('8.8.8.8');
console.log(host);

const results = await client.shodanSearch('apache country:DE', 1);
console.log(results);

const score = await client.shodanHoneyscore('198.51.100.1');
// score close to 1.0 = likely honeypot
```

---

### Universal Search

Queries LeakCheck, Snusbase, HackCheck, and Breach.vip **in parallel**.

```js
const result = await client.search('victim@example.com', 'email');
// also: 'phone', 'username', 'ip', 'auto'

console.log(result.sources_queried);
console.log(result.results.leakcheck.data);
console.log(result.results.snusbase.data);
```

---

### Breach Databases

```js
// Snusbase
await client.snusbase(['victim@example.com'], ['email']);
await client.snusbase(['hunter2'], ['password']);

// LeakCheck v2
await client.leakcheck('victim@example.com', 100, 0);

// HackCheck
await client.hackcheck('victim@example.com');

// Breach.vip
await client.breachvip('victim@example.com', ['email']);

// Cypher Dynamics (stealer logs)
await client.cypherDynamics('victim@example.com', 'email');

// LeakOSINT
await client.leakosint('victim@example.com', 'email');

// OathNet
await client.oathnetBreach('victim@example.com');
await client.oathnetStealer('example.com'); // domain stealer log search
```

---

### Social & Platform Recon

```js
// TikTok
const profile = await client.tiktok('username', 'basic');
// Use 'full' for video history + engagement (takes 10–30s)

// Discord → Roblox
const roblox = await client.discordToRoblox('1205957884584656927');

// Minecraft (via Crowsint)
await client.minecraft('Notch', 'username');
await client.minecraft('notch@gmail.com', 'email');
```

---

### IntelFetch

```js
// GitHub OSINT
const github = await client.githubIntel('torvalds', true);
console.log(github.data.email);

// Court records
const court = await client.courtSearch('John Smith', 'name');

// National People Database
const people = await client.npd({ firstname: 'John', lastname: 'Smith', city: 'Seattle' });

// Domain analysis
const domain = await client.domainIntel('example.com');
```

---

### SEON

```js
const email = await client.seonEmail('user@example.com');
console.log(email); // fraud score, deliverability, social footprint

const phone = await client.seonPhone('+15551234567');
console.log(phone); // carrier, line type, reputation
```

---

### Melissa (contact enrichment)

```js
// Name + address
await client.melissa({ first: 'John', last: 'Smith', a1: '1 Infinite Loop', city: 'Cupertino', state: 'CA', postal: '95014' });

// Email only
await client.melissa({ email: 'john@example.com' });

// Phone only
await client.melissa({ phone: '+15551234567' });
```

---

## Run All Examples

```bash
CSINT_API_KEY=your_key node examples.js
```

Comment out any examples in `examples.js` you don't need before running.

---

## Error Handling

All methods throw on non-2xx responses. The error includes `.status` (HTTP code) and `.body` (parsed response).

```js
try {
  const result = await client.ipLookup('not-an-ip');
} catch (err) {
  console.error(err.message);  // '[400] Invalid IP address'
  console.error(err.status);   // 400
  console.error(err.body);     // full error object from the API
}
```

Common status codes:

| Code | Meaning |
|------|---------|
| 400 | Bad request — check your parameters |
| 401 | Invalid or missing API key |
| 429 | Rate limit hit — back off and retry |
| 500 | Server or upstream provider error — retry after a delay |

---

## Rate Limits

| Limit | Value |
|-------|-------|
| Standard endpoints | 500 requests / hour (rolling) |
| IntelX | 50 requests / 24 hours |
| Concurrent requests | 10 per API key |

Check remaining quota anytime:

```js
const s = await client.status();
console.log(s.usage.remaining_hourly);
console.log(s.usage.intelx_usage.remaining_daily);
```

---

## Project Structure

```
csint.pro-API-example/
├── src/
│   └── client.js      # API client all methods live here
├── examples.js        # Runnable usage examples
├── .env.example       # Copy to .env and add your key
├── .gitignore
├── package.json
└── README.md
```

---

## Adding More Endpoints

Open `src/client.js` and find the comment at the bottom:

```js
// Add more endpoints here
```

All endpoints follow the same pattern:

```js
myEndpoint(param) {
  return this._post('/endpoint-path', { param });
}
```

Full endpoint reference: [csint.pro/docs](https://csint.pro/docs)

---

## Links

- **Platform**: [csint.pro](https://csint.pro)
- **Dashboard**: [csint.pro/dashboard](https://csint.pro/dashboard)
- **API Docs**: [csint.pro/docs](https://csint.pro/docs)
- **Discord**: [csint.pro/discord](https://csint.pro/discord)
- **Telegram**: [t.me/csintpro](https://t.me/csintpro)

---

## License

MIT
