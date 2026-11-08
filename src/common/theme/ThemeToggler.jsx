
import {Sun, Moon} from 'lucide-react'

import { useTheme } from "./ThemeProvider";

function ThemeToggler({size}) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      {theme === "light" ? (
        <Moon className={`size-${size}`} />
      ) : (
        <Sun className={`size-${size}`} />
      )}
    </button>
  );
}

export default ThemeToggler;
