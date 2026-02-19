import React, { useState, useEffect } from 'react';

function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onClick = (e) => {
    e.preventDefault();
    if (!promptInstall) return;
    promptInstall.prompt();
  };

  if (!supportsPWA) return null;

  return (
    <button
      className="btn btn-success position-fixed bottom-0 start-50 translate-middle-x mb-4 rounded-pill px-4 shadow-lg"
      style={{ zIndex: 2000, backgroundColor: '#1c3124', border: 'none' }}
      onClick={onClick}
    >
      Install Mahal Connect App
    </button>
  );
}

export default InstallPWA;