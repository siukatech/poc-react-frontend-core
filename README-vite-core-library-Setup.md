
Step 1 — Do NOT Use Webpack App Setup
**Create new project folder**  
```bash
npm create vite@latest react-core -- --template react-ts
```
**In existing project folder**  
```bash
npm create vite@latest . -- --template react-ts
```

Step 2 — Convert Vite To Library Mode
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

Step 3 — Important: React Version Strategy
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


Step 4 — Move Your Existing core Code
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

Remove These From Core
Your core project should NOT contain:
- index.html
- main.tsx
- ReactDOM.render
- Application routes
- Feature pages
- Concrete business services

Core = framework-level only.


Step 6 — Build Library
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


Step 7 — Use It From Your App
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






