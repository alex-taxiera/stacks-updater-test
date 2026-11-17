import { Provider } from "@stacks-updater-test/ui/provider";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "#/App";

const root = document.getElementById("root");
if (!root) throw new Error("index.html has no #root element");

createRoot(root).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
);
