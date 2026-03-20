#!/usr/bin/env node
'use strict';

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Parse CLI args: generate.js "<prompt>" [--model <id>] [--output-dir <dir>]
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help') {
  console.error('Usage: node generate.js "<prompt>" [--model <model-id>] [--output-dir <dir>]');
  console.error('');
  console.error('Default model: google/gemini-3.1-flash-image-preview');
  console.error('Requires: OPENROUTER_API_KEY environment variable');
  process.exit(1);
}

let prompt = '';
let model = 'google/gemini-3.1-flash-image-preview';
let outputDir = process.cwd();

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--model' && args[i + 1]) {
    model = args[++i];
  } else if (args[i] === '--output-dir' && args[i + 1]) {
    outputDir = args[++i];
  } else if (!args[i].startsWith('--')) {
    prompt = prompt ? `${prompt} ${args[i]}` : args[i];
  }
}

if (!prompt) {
  console.error('Error: prompt is required');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// API key guard
// ---------------------------------------------------------------------------
const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  console.error(
    'Error: OPENROUTER_API_KEY is not set.\n' +
    'Set it in your environment and try again:\n' +
    '  Windows: $env:OPENROUTER_API_KEY="sk-or-..."\n' +
    '  Unix:    export OPENROUTER_API_KEY="sk-or-..."'
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Route to endpoint based on model
// imagen / flux / dall-e → images/generations (image-only models)
// gemini / everything else → chat/completions (multimodal)
// ---------------------------------------------------------------------------
const IMAGE_ONLY_PATTERNS = ['imagen', 'flux', 'dall-e', 'stable-diffusion', 'midjourney'];
const isImageOnly = IMAGE_ONLY_PATTERNS.some(p => model.toLowerCase().includes(p));

const OPENROUTER_HOST = 'openrouter.ai';
const endpoint = isImageOnly ? '/api/v1/images/generations' : '/api/v1/chat/completions';

const requestBody = isImageOnly
  ? JSON.stringify({ model, prompt, response_format: { type: 'b64_json' } })
  : JSON.stringify({ model, messages: [{ role: 'user', content: prompt }] });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function httpsPost(hostname, urlPath, headers, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      path: urlPath,
      method: 'POST',
      headers: { ...headers, 'Content-Length': Buffer.byteLength(body) },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function downloadUrl(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
  });
}

function extractBase64FromDataUri(dataUri) {
  const match = dataUri.match(/^data:image\/[^;]+;base64,(.+)$/s);
  return match ? match[1] : null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.error(`Model:  ${model}`);
  console.error(`Prompt: ${prompt}`);
  console.error(`Calling OpenRouter (${endpoint})...`);

  const { status, body: response } = await httpsPost(
    OPENROUTER_HOST,
    endpoint,
    {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://claude.ai',
      'X-Title': 'Claude Image Generator',
    },
    requestBody
  );

  if (status !== 200) {
    const msg = response?.error?.message || JSON.stringify(response, null, 2);
    console.error(`OpenRouter API error (HTTP ${status}):\n${msg}`);
    process.exit(1);
  }

  // ---- Extract image buffer ------------------------------------------------
  let imageBuffer = null;

  if (isImageOnly) {
    // images/generations: data[0].b64_json or data[0].url
    const item = response?.data?.[0];
    if (item?.b64_json) {
      imageBuffer = Buffer.from(item.b64_json, 'base64');
    } else if (item?.url) {
      imageBuffer = await downloadUrl(item.url);
    }
  } else {
    // chat/completions: image may be in content parts or data array
    const choice = response?.choices?.[0];
    const content = choice?.message?.content;

    if (Array.isArray(content)) {
      // Multimodal content array
      for (const part of content) {
        if (part.type === 'image_url') {
          const url = part.image_url?.url ?? part.image_url;
          if (url?.startsWith('data:')) {
            const b64 = extractBase64FromDataUri(url);
            if (b64) imageBuffer = Buffer.from(b64, 'base64');
          } else if (url) {
            imageBuffer = await downloadUrl(url);
          }
          if (imageBuffer) break;
        }
      }
    } else if (typeof content === 'string') {
      // Inline data URI in text
      const b64 = extractBase64FromDataUri(content);
      if (b64) imageBuffer = Buffer.from(b64, 'base64');
    }

    // Fallback: some models put the image in response.data
    if (!imageBuffer && response?.data?.[0]?.b64_json) {
      imageBuffer = Buffer.from(response.data[0].b64_json, 'base64');
    }
  }

  if (!imageBuffer) {
    console.error('No image data found in response.');
    console.error('Full response:', JSON.stringify(response, null, 2));
    process.exit(1);
  }

  // ---- Save file -----------------------------------------------------------
  const timestamp = Date.now();
  const filename = `generated-image-${timestamp}.png`;
  const outputPath = path.join(outputDir, filename);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, imageBuffer);

  // Print the path so the caller (Claude) can report it
  console.log(`Image saved: ${outputPath}`);
}

main().catch((err) => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
