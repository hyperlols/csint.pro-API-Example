'use strict';

const BASE_URL = 'https://csint.pro/api';

/**
 * csint.pro API Client
 * All endpoints use POST with JSON body and X-API-Key header.
 */
class CsintClient {
  constructor(apiKey) {
    if (!apiKey) throw new Error('API key is required. Get yours at csint.pro/dashboard');
    this.apiKey = apiKey;
  }

  async _post(endpoint, body = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const message = isJson ? (data.message || data.error || JSON.stringify(data)) : data;
      const err = new Error(`[${res.status}] ${message}`);
      err.status = res.status;
      err.body = data;
      throw err;
    }

    return data;
  }

  // Account

  /** Check API key status, usage, and rate limits */
  status() {
    return this._post('/status');
  }

  // In-House Modules

  /** Discord user lookup — profile, servers, messages, IP & email if available */
  discordLookup(userId) {
    return this._post('/discord/lookup', { user_id: userId });
  }

  /** Discord OSINT — IP and email linked to a Discord ID */
  discordOsint(userId) {
    return this._post('/discord/osint', { user_id: userId });
  }

  /** Discord messages index statistics */
  discordStats() {
    return this._post('/discord/stats');
  }

  /** IP address geolocation, threat scoring, ASN, anonymizer detection */
  ipLookup(ip) {
    return this._post('/iplookup', { ip });
  }

  /**
   * Cryptocurrency wallet analysis — balance, transactions, risk score
   * @param {string} address  Wallet address
   * @param {'BTC'|'ETH'|'LTC'|'DOGE'} crypto  Currency symbol
   */
  cryptoAnalyze(address, crypto) {
    return this._post('/crypto', { address, crypto });
  }

  /**
   * AI image geolocation — submit a base64 image, get location estimate + confidence
   * @param {string} imageBase64  Base64-encoded JPEG, PNG, or WebP (max 8 MB)
   */
  geolocateImage(imageBase64) {
    return this._post('/geolocate', { image: imageBase64 });
  }

  /**
   * AI email analyzer — multi-source breach intel summarized by AI
   * @param {string} email  Target email address
   */
  analyzeEmail(email) {
    return this._post('/email/analyze', { email });
  }

  // Intelligence X

  /**
   * Download an IntelX item by System ID (returns raw text, not JSON)
   * Note: limited to 50 requests/day. Response is plain text.
   * @param {string} systemId  IntelX System ID (UUID format)
   */
  intelxDownload(systemId) {
    return this._post('/intelx', { query: systemId });
  }

  // Shodan

  /** Shodan host intelligence for a given IP */
  shodanHost(ip, history = false) {
    return this._post('/shodan/host', { ip, history });
  }

  /** Shodan search query */
  shodanSearch(query, page = 1) {
    return this._post('/shodan/search', { query, page });
  }

  /** Shodan DNS lookup for a domain */
  shodanDns(domain) {
    return this._post('/shodan/dns', { domain });
  }

  /** Shodan exploit search */
  shodanExploits(query) {
    return this._post('/shodan/exploits', { query });
  }

  /** Check if an IP is a honeypot (0.0 = clean, 1.0 = honeypot) */
  shodanHoneyscore(ip) {
    return this._post('/shodan/honeyscore', { ip });
  }

  // Universal Search

  /**
   * Multi-source breach search — queries LeakCheck, Snusbase, HackCheck, Breach.vip in parallel
   * @param {string} query  Email, phone, username, or IP
   * @param {'email'|'phone'|'username'|'ip'|'auto'} type
   */
  search(query, type = 'auto') {
    return this._post('/search', { query, type });
  }

  // Breach Databases

  /** Snusbase search — email, username, lastip, hash, password, name */
  snusbase(terms, types, wildcard = false) {
    return this._post('/snusbase/search', { terms, types, wildcard });
  }

  /** LeakCheck v2 search */
  leakcheck(term, limit = 1000, offset = 0) {
    return this._post('/leakcheck/v2', { term, limit, offset });
  }

  /** HackCheck credential search */
  hackcheck(term, searchType) {
    return this._post('/hackcheck', { term, search_type: searchType });
  }

  /** Breach.vip community breach database */
  breachvip(term, fields = [], options = {}) {
    return this._post('/breachvip/search', { term, fields, ...options });
  }

  /** LeakOSINT — email, phone, or IP breach search */
  leakosint(query, type, lang = 'en') {
    return this._post('/leakosint/search', { query, type, lang });
  }

  /** Cypher Dynamics stealer log & credential search */
  cypherDynamics(term, type, limit = 1000) {
    return this._post('/cypherdynamics/search', { term, type, limit });
  }

  /** OathNet breach database */
  oathnetBreach(query) {
    return this._post('/oathnet/breach', { query });
  }

  /** OathNet stealer log search by email or domain */
  oathnetStealer(query) {
    return this._post('/oathnet/stealer', { query });
  }

  // Social & Platform Recon

  /** TikTok profile recon — basic (fast) or full (video history + engagement) */
  tiktok(username, type = 'basic') {
    return this._post('/tiktokrecon', { username, type });
  }

  /** Minecraft breach lookup via Crowsint */
  minecraft(query, type) {
    return this._post('/crowsint/minecraft', { query, type });
  }

  /** Roblox account linked to a Discord ID via OathNet */
  discordToRoblox(discordId) {
    return this._post('/oathnet/discord-to-roblox', { discord_id: discordId });
  }

  // SEON

  /** SEON email intelligence and fraud scoring */
  seonEmail(email) {
    return this._post('/seon/email', { email });
  }

  /** SEON phone intelligence and carrier lookup */
  seonPhone(phone) {
    return this._post('/seon/phone', { phone });
  }

  // IntelFetch

  /** GitHub OSINT via IntelFetch */
  githubIntel(username, extensive = true) {
    return this._post('/intelfetch/github', { username, extensive });
  }

  /** Court records search */
  courtSearch(terms, mode = 'name') {
    return this._post('/intelfetch/courtsearch', { mode, terms });
  }

  /** National People Database lookup */
  npd({ firstname, lastname, city } = {}) {
    return this._post('/intelfetch/npd', { firstname, lastname, city });
  }

  /** Domain DNS + infrastructure analysis */
  domainIntel(domain) {
    return this._post('/intelfetch/domain', { domain });
  }

  // Melissa

  /**
   * Contact validation and enrichment
   * @param {Object} fields  Any combo of: first, last, email, phone, a1, city, state, postal
   */
  melissa(fields) {
    return this._post('/melissa/lookup', fields);
  }

  // Add more endpoints here
  // See full endpoint list at https://csint.pro/docs
  //
  // Examples:
  //   BreachBase:    this._post('/breachbase', { term })
  //   IntelVault:    this._post('/intelvault', { field: [{ email: '...' }] })
  //   Akula:         this._post('/akula', { searchTerm, search_type })
  //   LeakSight:     this._post('/leaksight', { term })
  //   Inf0Sec leaks: this._post('/inf0sec/leaks', { q })
  //   Inf0Sec domain:this._post('/inf0sec/domain', { q })
}

module.exports = CsintClient;
