import "@/styles/globals.css";
import "../styles/tailwind.css";
import "../styles/styles.module.css"; // Import other global styles if needed

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
