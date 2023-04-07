# GPTinker

A proof of concept of a LLM-based developer sidekick that can make changes in existing code repositories.

## Running the app

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## TODO

* Create an indexer that will scan the codebase file-by-file and feed them to GPT-3.5 for summarization. Then these summaries would be converted to embeddings and both would be stored in an index. This would then be used by the app to answer questions about the codebase or to locate files that need to be modified.
* More / improved commands
  * FindText - find instances of a word inside the repo and return results (possibly using regex), should return context