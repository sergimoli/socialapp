import ReactDOM from "react-dom/client";
import App from "./App.jsx";

//imports assets(recursos - fulles estil, images, fonts)
import "./assets/fonts/fontawesome-free-6.1.2-web/css/all.css";
import "./assets/css/normalize.css";
import "./assets/css/styles.css";
import "./assets/css/responsive.css";

//carregar configuració react time ago

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(en);

//arrancar app de React
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
