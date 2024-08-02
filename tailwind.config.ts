// tailwind.config.ts
/** @type {import('tailwincss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./pages/**/*.{vue,ts}", "./components/**.{vue,ts}", "presets/**/*.{js,vue,ts}"],
    theme: {
        extend: {
            colors: {
                primary:
                    'rgb(var(--primary))',
                'primary-inverse': 'rgb(var(--primary-inverse))',
                'primary-hover': 'rgb(var(--primary-hover))',
                'primary-active-color': 'rgb(var(--primary-active-color))',

                'primary-highlight': 'rgb(var(--primary)/var(--primary-highlight-opacity))',
                'primary-highlight-inverse': 'rgb(var(--primary-highlight-inverse))',
                'primary-highlight-hover': 'rgb(var(--primary)/var(--primary-highlight-hover-opacity))',

                // 全局颜色变量

                /* 背景颜色 [外部圆角矩形] */
                "LightBg": "#f0f2f5",       // 浅灰
                "DarkBg": "#1f1f1f",        // 黑色

                /* 内容颜色 [侧边以及中间圆角矩形] */
                "LightContent": "#fefefe",  // 白色
                "DarkContent": "#3e4044",   // 深灰色

                /* 主题修饰颜色 [部分突出部分] */
                "LightEm": "#00c64b",       // 绿色色调
                "DarkEm": "#ffca0b",        // 黄色色调

                /* 突出部分hover颜色 */
                "HoverLightEm": "#009e3d",  // 深绿
                "HoverDarkEm": "#a88400",   // 深黄

            },
            backgroundImage: {
                "lightOutBgImage": "linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%)",
                "darkOutBgImage": "linear-gradient(to top, #09203f 0%, #537895 100%)"
            }
        }
    }
}