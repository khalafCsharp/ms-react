import { createContext, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";

const themeContext = createContext();

function ThemeProvider({ children }) {
    
  const [theme, setTheme] = useState(() => {
    const localTheme = localStorage.getItem("theme") || "light";
    return localTheme;
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.className = theme;
  }, [theme]);

  function toggleTheme(e) {
    const next = theme === "light" ? "dark" : "light";

    if (!document.startViewTransition) {
      setTheme(next);
      return;
    }

    if (e) {
      document.documentElement.style.setProperty("--x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--y", `${e.clientY}px`);
    }

    document.startViewTransition(() => {
      flushSync(() => {
        setTheme(next);
      });
    });
  }

  return (
    <themeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </themeContext.Provider>
  );
}

export default ThemeProvider;

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(themeContext);
}
