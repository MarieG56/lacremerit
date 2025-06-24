# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with Hot Module Replacement (HMR) and some ESLint rules.

## Overview

This starter template comes configured with:
- **React** and **TypeScript** for building your application.
- **Vite** as the build tool, offering fast startup and HMR.
- A basic **ESLint** configuration to help enforce code quality and consistency.

## Plugins for Fast Refresh

Currently, two official plugins are available for enabling Fast Refresh in your React application:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) – Uses [Babel](https://babeljs.io/) for Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) – Uses [SWC](https://swc.rs/) for Fast Refresh.

You can choose either plugin based on your performance and compatibility requirements.

## Expanding the ESLint Configuration

For production applications, it is recommended to update the ESLint configuration to enable type-aware lint rules. You can replace the recommended config with a stricter or stylistic variant:

```js
export default tseslint.config({
  extends: [
    // Replace with one of the following:
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, for stricter rules:
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add these for more stylistic rules:
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

## Adding React-Specific ESLint Plugins

To further enforce React-specific linting rules, you can install and configure the following plugins:

- [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x)
- [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom)

Below is an example of how to include these plugins in your ESLint configuration:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // Enable the recommended TypeScript rules for react-x and react-dom
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## Getting Started

1. **Install Dependencies**

   Use your package manager to install the dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the Development Server**

   Start Vite in development mode:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Build for Production**

   When you're ready to build for production:

   ```bash
   npm run build
   # or
   yarn build
   ```

4. **Lint Your Code**

   Run the linter to check your code:

   ```bash
   npm run lint
   # or
   yarn lint
   ```

## Conclusion

This template provides a streamlined starting point for a React + TypeScript application with Vite. Customize the ESLint configuration and other settings according to your project requirements as you scale your application.
