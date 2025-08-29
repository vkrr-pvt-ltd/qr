import { useEffect, useState } from "react";

function App() {
  const [redirects, setRedirects] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSj0nm6f5ZVOea9owlKNj_IunOKh_x3qZqHi9NjhNnE2_n525HIWZgMfxlUrYaPxRYmTALM4FWboMjJ/pub?gid=0&single=true&output=csv")
      .then(res => res.text())
      .then(text => {
        const lines = text.split("\n");
        const map: { [key: string]: string } = {};
        for (let i = 1; i < lines.length; i++) {
          const [path, url] = lines[i].split(",");
          if (path && url) map[path.trim()] = url.trim();
        }
        setRedirects(map);
      });
  }, []);

  // 🔹 2. Redirect if URL matches `/qr/redirect/<key>`
  useEffect(() => {
    const parts = window.location.pathname.split("/");
    if (parts[1] === "qr" && parts[2] === "redirect") {
      const key = parts[3];
      if (redirects[key]) {
        window.location.replace(redirects[key]);
      }
    }
  }, [redirects]);

  return <div>🔀 Redirector is running...</div>;
}

export default App;
