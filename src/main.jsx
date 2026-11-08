import { createRoot } from "react-dom/client";

import "./index.css";

import "./common/interceptors";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);
