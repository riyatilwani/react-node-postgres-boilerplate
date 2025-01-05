import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import store from "./store/store";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </Provider>
  </BrowserRouter>
);

if (process.env.NODE_ENV === 'production') {
  registerServiceWorker();
}
