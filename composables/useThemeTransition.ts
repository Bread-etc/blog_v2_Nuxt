// 切换主题动画效果
export const useThemeTransition = () => {
  const theme = useColorMode();
  const setTheme = (color: string) => {
    theme.preference = color === "dark" ? "light" : "dark";
  };

  const toggleTheme = (event: MouseEvent) => {
    // 如果浏览器不支持 View Transitions API, 则直接切换主题
    if (!document.startViewTransition) {
      setTheme(theme.value);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    // 启动视图过渡
    const transition = document.startViewTransition(() => {
      const root = document.documentElement;
      root.style.setProperty("--circle-position-x", `${x}px`);
      root.style.setProperty("--circle-position-y", `${y}px`);
      root.style.setProperty("--transition-radius", `${endRadius}px`);
      // 在回调中更新主题
      setTheme(theme.value);
    });

    // 动画结束后清理 CSS 变量
    transition.finished.finally(() => {
      const root = document.documentElement;
      root.style.removeProperty("--circle-position-x");
      root.style.removeProperty("--circle-position-y");
      root.style.removeProperty("--transition-radius");
    });
  };

  return { theme, toggleTheme };
};
