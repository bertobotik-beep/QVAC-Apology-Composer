# QVAC Apology Composer

Describe what happened and choose a severity/formality level, and an on-device AI writes a sincere apology tailored to that specific situation.

## Run

```
npm install
npm start
```

Then open http://localhost:29542

## QVAC SDK

Uses `@qvac/sdk` ^0.19.0 for fully local, on-device LLM inference. No cloud calls, no API key required.

## How it works

The server loads a small local model at startup with `loadModel`. Your description of the situation and chosen severity level are sent to the model through `completion()`, which reasons about the specific details you gave (not a fill-in-the-blank template) to write an apology matching that tone. `unloadModel` releases the model on shutdown.

## License

MIT
