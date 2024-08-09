/** @type {import('tailwincss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./pages/**/*.{vue,ts}", "./components/**.{vue,ts}"],
  theme: {
    extend: {
      colors: {
        // 全局颜色变量

        /* 背景颜色 [外部圆角矩形] */
        LightBg: "#f0f2f5", // 浅灰
        DarkBg: "#1f1f1f", // 黑色

        /* 内容颜色 [侧边以及中间圆角矩形] */
        LightContent: "#fefefe", // 白色
        DarkContent: "#3e4044", // 深灰色

        /* 主题修饰颜色 [部分突出部分] */
        LightEm: "#00c64b", // 绿色色调
        DarkEm: "#ffca0b", // 黄色色调

        /* 突出部分hover颜色 */
        HoverLightEm: "#009e3d", // 深绿
        HoverDarkEm: "#a88400", // 深黄
      },
      backgroundImage: {
        lightOutBgImage: "linear-gradient(to top, #fddb92 0%, #d1fdff 100%)",
        darkOutBgImage: "linear-gradient(to top, #09203f 0%, #537895 100%)",
      },
    },
  },
  plugins: [],
};
