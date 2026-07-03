# Saybrook Zoning Query Prompt Config

The prompt should live in the repo, not as a giant hardcoded string buried in the
`Build Prompt` code node.

Canonical prompt file:

- `prompts/saybrook-zoning-query-prompt.json`

## Recommended n8n shape

Add two nodes before or around `Build Prompt`:

1. `Load Prompt Config`
- read the JSON file from a path n8n can see
- ideal if your repo is mounted into the n8n container

2. `Parse Prompt Config`
- parse the JSON file so the next code node can access:
  - `main_prompt`
  - `no_context_prompt`
  - `model`
  - `temperature`

If n8n cannot see the repo path directly, place the same JSON file in a mounted/shared
path and point `Load Prompt Config` there instead.

## Exact `Build Prompt` code node logic

Replace the current prompt-building logic with:

```javascript
const question = $('Normalize Input').first().json.question;
const results = Array.isArray($json.result) ? $json.result : [];
const promptConfig = $('Parse Prompt Config').first().json;

if (!promptConfig || typeof promptConfig !== 'object') {
  throw new Error('Prompt config is missing or invalid');
}

const citations = results.map((hit, idx) => ({
  source: hit.payload?.source_file || 'Saybrook Zoning Code',
  section: hit.payload?.section || null,
  page: hit.payload?.page || null,
  score: hit.score,
  quote: (hit.payload?.content || '').slice(0, 260),
  point_key: hit.payload?.point_key || String(hit.id)
}));

const context = results.map((hit, idx) => {
  const payload = hit.payload || {};
  const heading = payload.section || payload.point_key || `Chunk ${idx + 1}`;
  return `[${idx + 1}] ${heading}\n${payload.content || ''}`;
}).join('\n\n---\n\n');

const template =
  results.length > 0
    ? promptConfig.main_prompt
    : promptConfig.no_context_prompt;

if (typeof template !== 'string' || !template.trim()) {
  throw new Error('Prompt template is missing');
}

const prompt = template
  .replaceAll('{{QUESTION}}', question)
  .replaceAll('{{CONTEXT}}', context);

return [{
  json: {
    question,
    contextCount: results.length,
    prompt,
    citations,
    model: promptConfig.model || 'llama3.1:8b',
    temperature:
      typeof promptConfig.temperature === 'number'
        ? promptConfig.temperature
        : 0.2
  }
}];
```

## Exact `Generate Answer` body change

Instead of hardcoding the model and temperature in the node body, use:

```json
={{ {
  model: $json.model || 'llama3.1:8b',
  prompt: $json.prompt,
  stream: false,
  options: {
    temperature: typeof $json.temperature === 'number' ? $json.temperature : 0.2
  }
} }}
```

## Why this is better

- prompt changes live in versioned repo files
- no more editing giant prompt strings inside n8n
- model/temperature can travel with the prompt config
- evaluation-mode wording can be changed quickly without breaking workflow logic
