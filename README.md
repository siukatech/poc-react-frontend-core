

Create Project
```bash
npm init -y
```

Install React 17
```bash
npm install react@17 react-dom@17
```

Install TypeScript 5.1.3
```bash
npm install typescript@5.1.3 --save-dev
```

Install Webpack 5 Tooling
```bash
npm install --save-dev \
webpack \
webpack-cli \
webpack-dev-server \
ts-loader \
@types/react@17 \
@types/react-dom@17 \
html-webpack-plugin \
css-loader \
style-loader
```

Create tsconfig.json
```bash
npx tsc --init
```

Modify:
```js
{
  "compilerOptions": {
    "target": "ES6",
    "lib": ["DOM", "ES6"],
    "jsx": "react",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

Create webpack.config.js
```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  devtool: "source-map",
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    })
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true
  }
};
```

Create Folder Structure
```text
public/
   index.html
src/
   index.tsx
   App.tsx
```

index.html
```html
<!DOCTYPE html>
<html>
  <head>
    <title>React 17 Core</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

index.tsx
```tsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));
```

App.tsx
```tsx
export default function App() {
  return <h1>React 17 + TS 5 + Webpack 5</h1>;
}
```

Add Scripts
In package.json:
```json
"scripts": {
  "start": "webpack serve --open",
  "build": "webpack --mode production"
}
```

Run It
```bash
npm start
```
