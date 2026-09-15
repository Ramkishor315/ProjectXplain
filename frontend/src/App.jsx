import { useEffect, useState } from 'react';
import { getHealth } from './services/api';

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking backend...');

  useEffect(() => {
    getHealth()
      .then((data) => setBackendStatus(`${data.status} - ${data.service}`))
      .catch(() => setBackendStatus('Backend is not running'));
  }, []);

  return (
    <main className="page">
      <section className="intro">
        <p className="eyebrow">ProjectXplain</p>
        <h1>Understand your software project one idea at a time.</h1>
        <p className="description">
          ProjectXplain will eventually turn a project idea into simple,
          connected explanations of its software engineering concepts.
        </p>
        <div className="status">
          <span className="status-dot" />
          Backend: {backendStatus}
        </div>
      </section>
    </main>
  );
}

export default App;