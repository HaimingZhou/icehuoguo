/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit', // 允许在运行时生成新的实用程序类,目的是为了动态生成类名
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
