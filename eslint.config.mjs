import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Turn off @typescript-eslint/no-unused-vars
      "@typescript-eslint/no-unused-vars": "off",
      
      // Turn off react/no-unescaped-entities
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-explicit-any":"off", 

      // Disable ESLint warnings for `@ts-ignore`
      "no-warning-comments": [
        "error",
        {
          "terms": ["@ts-ignore", "@ts-expect-error"],
          "location": "start"
        }
      ],
    },
  },
];

export default eslintConfig;
