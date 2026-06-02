// We need this becuase TailwindCSS/Vite is not compatible with Vite 8
// workaround using postcss, which adds plugins to our CSS
export default {
  plugins: {
    "@tailwindcss/postcss": {}
  }
};
