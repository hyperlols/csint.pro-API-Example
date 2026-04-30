'use strict';

/**
 * csint.pro API - Usage Examples
 * Run: node examples.js
 *
 * Set your API key as an environment variable:
 *   export CSINT_API_KEY=your_key_here
 */

const CsintClient = require('./src/client');

const client = new CsintClient(process.env.CSINT_API_KEY);

// Helpers

function section(title) {
  console.log('\n' + '─'.repeat(60));
  console.log(`  ${title}`);
  console.log('─'.repeat(60));
}

function print(label, data) {
  console.log(`\n[${label}]`);
  console.log(JSON.stringify(data, null, 2));
}

// Examples

async function runExamples() {
  // Pick whichever examples you want to run and comment out the rest.

  // Account status
  section('Account Status');
  const status = await client.status();
  print('status', status);

  // Universal search (multi-source breach lookup)
  section('Universal Search — email');
  const searchResult = await client.search('victim@example.com', 'email');
  print('search', searchResult);

  // In-House: IP Lookup
  section('IP Lookup');
  const ip = await client.ipLookup('8.8.8.8');
  print('ipLookup', ip);

  // In-House: Discord Lookup
  section('Discord Lookup');
  const discord = await client.discordLookup('123456789123456789');
  print('discordLookup', discord);

  // In-House: Discord OSINT
  section('Discord OSINT (IP + email)');
  const discordOsint = await client.discordOsint('123456789123456789');
  print('discordOsint', discordOsint);

  // In-House: Crypto wallet
  section('Crypto Wallet — Bitcoin');
  const btc = await client.cryptoAnalyze('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'BTC');
  print('cryptoAnalyze BTC', btc);

  // In-House: AI Email Analyzer
  section('AI Email Analyzer');
  const emailReport = await client.analyzeEmail('target@example.com');
  print('analyzeEmail', emailReport);

  // ── In-House: AI Image Geolocation ────────────────────────────────────────
  // section('AI Image Geolocation');
  // const fs = require('fs');
  // const imageBase64 = fs.readFileSync('./image.jpg').toString('base64');
  // const geo = await client.geolocateImage(imageBase64);
  // print('geolocateImage', geo);

  // Intelligence X
  section('IntelX Download');
  // Supply a real System ID from an IntelX search
  const intelx = await client.intelxDownload('bd372637-0069-4d3f-8c8d-5d354b88671d');
  print('intelxDownload (raw text preview)', String(intelx).slice(0, 500));

  // Shodan
  section('Shodan — Host Intel');
  const shodanHost = await client.shodanHost('8.8.8.8');
  print('shodanHost', shodanHost);

  section('Shodan — Search');
  const shodanSearch = await client.shodanSearch('apache country:US', 1);
  print('shodanSearch', shodanSearch);

  section('Shodan — Honeyscore');
  const honeyscore = await client.shodanHoneyscore('8.8.8.8');
  print('shodanHoneyscore', honeyscore);

  // Breach Databases
  section('Snusbase');
  const snusbase = await client.snusbase(['victim@example.com'], ['email']);
  print('snusbase', snusbase);

  section('LeakCheck v2');
  const leakcheck = await client.leakcheck('victim@example.com', 100);
  print('leakcheck', leakcheck);

  section('Cypher Dynamics');
  const cd = await client.cypherDynamics('victim@example.com', 'email');
  print('cypherDynamics', cd);

  // Social / Platform
  section('TikTok Recon — basic');
  const tiktok = await client.tiktok('example_user', 'basic');
  print('tiktok', tiktok);

  section('Discord → Roblox');
  const roblox = await client.discordToRoblox('1205957884584656927');
  print('discordToRoblox', roblox);

  // IntelFetch
  section('GitHub Intel');
  const github = await client.githubIntel('torvalds');
  print('githubIntel', github);

  section('Court Records Search');
  const court = await client.courtSearch('John Smith');
  print('courtSearch', court);

  // SEON
  section('SEON — Email');
  const seon = await client.seonEmail('user@example.com');
  print('seonEmail', seon);
}

// Run

runExamples().catch(err => {
  console.error('\n[ERROR]', err.message);
  if (err.body) console.error('Response body:', JSON.stringify(err.body, null, 2));
  process.exit(1);
});
