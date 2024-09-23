// import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ContextState from "./context/ContextState";
import * as Sentry from "@sentry/react";
import { BASE_URL_V1, BASE_URL_V2, SENTRY_DSN_KEY } from "./config";

const root = ReactDOM.createRoot(document.getElementById("root"));

if (SENTRY_DSN_KEY) {
  Sentry.init({
    dsn: SENTRY_DSN_KEY,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [BASE_URL_V1, BASE_URL_V2],
    // Session Replay
    replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
  root.render(
    <Sentry.ErrorBoundary fallback="An error has occurred">
      <ContextState>
        <App />
      </ContextState>
    </Sentry.ErrorBoundary>
  );
} else {
  root.render(
    <ContextState>
      <App />
    </ContextState>
  );
}

reportWebVitals();
