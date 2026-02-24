
# Step 1 — Do NOT Use Webpack App Setup
**Create new project folder**  
```bash
npm create vite@latest react-core -- --template react-ts
```
**In existing project folder**  
```bash
npm create vite@latest . -- --template react-ts
```

# Step 2 — Convert Vite To Library Mode
Edit vite.config.ts  
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "ReactCore",
      fileName: "react-core"
    },
    rollupOptions: {
      external: ["react", "react-dom", "react-router-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    }
  }
});

```

# Step 3 — Important: React Version Strategy
Since you’re currently on React 17:  
In your react-core/package.json:  
  "dependencies": {  
  ~~"react": "^19.2.0",~~  
  ~~"react-dom": "^19.2.0"~~  
  },
```json
"dependencies": {
},
"peerDependencies": {
  "react": "^17 || ^18",
  "react-dom": "^17 || ^18"
}
```
And remove react from dependencies.  
Why?  
Because your core library must NOT bundle React.  
The consuming app provides React.  

This is critical for reusability.  


# Step 4 — Move Your Existing core Code
Now you can safely copy
```bash
core/app
core/services
core/runtime
core/router
```

into
```bash
react-core/src/
```
Then create a clean export file.


# Step 5 — Create src/index.ts (Library Entry)
Export only public API:
```ts
export * from "./app/AppConfigContext";
export * from "./app/AppRouter";
export * from "./services";
export * from "./runtime/runtimeConfig";
```
Do NOT export everything blindly.
Control your public surface.

## Remove These From Core
Your core project should NOT contain:
- index.html
- main.tsx
- ReactDOM.render
- Application routes
- Feature pages
- Concrete business services

Core = framework-level only.


# Step 6 — Build Library
```bash
npm run build
```

You will get:
```bash
dist/
  react-core.es.js
  react-core.umd.js
```
Now it’s a reusable package.


# Step 7 — Use It From Your App
In your main project:
```bash
npm install ../react-core
```

Then:
```ts
import { AppConfigContext, AppRouter } from "react-core";

```

Your features project becomes:
```
core (library)
features (app)
```
Perfect separation.


# Optional: Better Setup (Recommended)
Instead of separate repos, use:
Monorepo (pnpm workspace)
```markdown
my-platform/
  packages/
    react-core/
    app/
```
Benefits:
- Easier development
- Shared TypeScript config
- No local npm linking weirdness
- Cleaner upgrade testing


# Important Architectural Rules
When extracting core:
1. Core must not depend on features.
1. Core must not import app routes.
1. Core can define interfaces.
1. App must implement interfaces.
1. Core exposes injection points.
1. Core must not create circular imports internally.


# Final Structure After Extraction
```lua
react-core/
   src/
     app/
     services/
     runtime/
     router/
   package.json
   vite.config.ts
```
```css
my-app/
   src/
     features/
     routes.ts
     main.tsx
```


# Why This Is the Right Move
You are now:
- Applying Dependency Inversion
- Building a real internal framework
- Preparing for micro-frontend if needed
- Making upgrade testing easier
- Decoupling business from infrastructure
This is senior-level architecture thinking.


# Library installation
```bash

rm -rf node_modules package-lock.json

npm i -S @types/react@18
npm i -S @types/react-dom@18

npm i -S react-redux@^9.2.0
npm i -S react-router-dom@^6.30.3

npm i -S @emotion/react@^11.14.0
npm i -S @emotion/styled@^11.14.1
npm i -S @jsonforms/core@3.3
npm i -S @jsonforms/material-renderers@3.3
npm i -S @jsonforms/react@3.3

npm i -S @mui/material@^5.18.0
npm i -S @mui/icons-material@^5.18.0
npm i -S @mui/lab@^5.0.0-alpha.143
npm i -S @mui/utils@^5.17.1
npm i -S @mui/x-data-grid@^6.20.4
npm i -S @mui/x-date-pickers@^6.20.2


npm i -S @reduxjs/toolkit@^2.11.2

npm i -S @rjsf/core@^5.24.13
npm i -S @rjsf/mui@^5.24.13
npm i -S @rjsf/utils@^5.24.13
npm i -S @rjsf/validator-ajv8@^5.24.13

npm i -S @tanstack/react-query@^4.43.0 --legacy-peer-deps

npm i -S @testing-library/jest-dom@^5.16.5
npm i -S @testing-library/react@^13.4.0
npm i -S @testing-library/user-event@^13.5.0

npm i -S @types/crypto-js@^4.2.2
npm i -S @types/lodash@^4.17.23
npm i -S @types/randomstring@^1.3.0
npm i -S @types/jest@^29.5.4

npm i -S axios@^1.13.5
npm i -S crypto-js@^4.2.0
npm i -S date-fns@^2.30.0
npm i -S date-fns-tz@^2.0.0

npm i -S i18next@^23.16.8
npm i -S i18next-http-backend@^2.7.3
npm i -S react-i18next@^13.5.0

npm i -S jsencrypt@^3.5.4
npm i -S jwt-decode@^3.1.2
npm i -S lodash@^4.17.23
npm i -S randomstring@^1.3.1

npm i -S uuidv7@^0.6.3


```




