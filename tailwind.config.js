/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 这一行必须准确，否则排版必乱
  ],
  theme: {
    extend: {
      fontFamily: {
        'chinese': ["Alibaba PuHuiTi 3.0", "PingFang SC", "Microsoft YaHei", "sans-serif"],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}