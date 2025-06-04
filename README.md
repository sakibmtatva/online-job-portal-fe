# React + TypeScript + Vite

**🎯 Project Overview: Job Portal Web App**

This is a full-stack job portal application designed to connect employers with potential candidates. The platform supports two main user roles — **Employers** and **Candidates**, each with their own set of features.

---

**👨‍💼 Employer Role:**

Employers can:

- Sign up and log in securely
- Create and manage job listings
- View all applications received for their jobs

---

**🧑‍💼 Candidate Role:**

Candidates can:

- Sign up and log in
- Browse all available jobs
- Apply to jobs directly from the portal
- Track the jobs they’ve applied to

---

**🧑‍💻 Frontend Tech Stack:**

- **React** for building the user interface
- **Tailwind CSS** for fast and responsive styling
- **Shadcn/UI** for ready-to-use, accessible components
- **Lucide Icons** for clean and modern iconography
- **Redux Toolkit** for managing app-wide state
- **Redux Persist** to maintain user sessions even after refresh

---

**🌐 Backend Tech Stack:**

- **Next.js API Routes** handle all backend operations
- **Mongoose** as an ODM to interact with **MongoDB Atlas**
- User authentication is handled using **JWT tokens**
- APIs are secured and designed around role-based access control

---

This app offers a complete end-to-end experience for both job seekers and employers, with a focus on clean UI, responsive design, and secure data handling.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

---

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
