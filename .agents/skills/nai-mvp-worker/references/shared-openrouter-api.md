# Shared OpenRouter API

The production deployment packages three same-origin Edge endpoints. The
`OPENROUTER_API_KEY` exists only on the server.

## `POST /api/ai`

Text and vision chat completions. Existing `{prompt, model, temperature,
maxTokens}` requests remain supported. Multimodal callers send OpenRouter-style
`messages` or Gemini-style `contents`.

```json
{
  "model": "google/gemini-2.5-pro",
  "messages": [{
    "role": "user",
    "content": [
      {"type": "text", "text": "Identify this artifact using the supplied local context."},
      {"type": "image_url", "image_url": {"url": "data:image/jpeg;base64,..."}}
    ]
  }],
  "response_format": {
    "type": "json_schema",
    "json_schema": {"name": "result", "strict": true, "schema": {}}
  },
  "reasoning": {"max_tokens": 512, "exclude": true}
}
```

Supported local image formats are PNG, JPEG, WEBP, and GIF. Remote images must
use HTTPS. The response preserves OpenRouter `choices` and also provides the
legacy Gemini-compatible `candidates` field and a top-level `text` field.
`maxTokens` is optional: when omitted, the shared client and proxy do not impose
or forward a completion-token ceiling. Callers may explicitly request a
positive `maxTokens` value when their product needs one. Optional OpenRouter
`reasoning` controls pass through unchanged.

## `POST /api/image`

Generates images using any OpenRouter image-model slug selected by the calling
MVP. The endpoint is purpose-neutral: portraits, diagrams, product mockups,
funny cats, restorations, and image-to-image transformations all use the same
contract.

```json
{
  "model": "google/gemini-2.5-flash-image",
  "prompt": "Historically grounded 1880s studio portrait...",
  "aspect_ratio": "1:1",
  "output_format": "png"
}
```

The endpoint supports `n`, `resolution`, `aspect_ratio`, `size`, `quality`,
`output_format`, `background`, `output_compression`, `seed`,
`input_references`, and `provider`. The JSON response contains
`images[].base64`, `images[].mimeType`, and a ready-to-render
`images[].dataUrl`.

All capabilities accept a syntactically valid OpenRouter model slug. Operators
may optionally restrict a deployment without changing application code by
setting comma-separated `OPENROUTER_CHAT_MODELS`, `OPENROUTER_IMAGE_MODELS`, or
`OPENROUTER_SPEECH_MODELS`. Without that explicit environment policy, each MVP
chooses its model and OpenRouter validates whether it supports the requested
capability.

## `POST /api/speech`

Generates speech and returns raw audio bytes.

```json
{
  "model": "google/gemini-3.1-flash-tts-preview",
  "input": "Welcome to Ashtabula Harbor...",
  "voice": "Kore",
  "response_format": "mp3"
}
```

Successful responses use `audio/mpeg` for MP3 or `audio/pcm` for PCM. Errors are
JSON. Model and voice availability can change; callers should check the current
OpenRouter catalog.

## Browser helpers

`shared/api-client.js` exports:

- `callOpenRouterAPI(prompt, options)` for text;
- `callVisionAPI(prompt, image, options)` for a File, Blob, HTTPS URL, or data URL;
- `generateImage(prompt, options)` for portrait/image generation;
- `generateSpeech(text, options)` returning an audio `Blob`.

MVPs should send a deployment/context identifier and relevant location metadata
in the text portion of the vision request. Institution research should remain
server-controlled rather than shipping private source packets in the browser.
