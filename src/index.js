import React from "react";
import ReactDOM from "react-dom/client"; // Note the change here
import { BrowserRouter as Router } from "react-router-dom";

import "./index.css";
import App from "./App";
import { StateProvider } from "./Context/StateProvider";
import { initialState } from "./Context/initalState";
import reducer from "./Context/reducer";

// Create a root.
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app into the root.
root.render(
  <React.StrictMode>
    <Router>
      <StateProvider initialState={initialState} reducer={reducer}>
        <App />
      </StateProvider>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
