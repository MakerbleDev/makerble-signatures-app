import { useNavigate } from 'react-router-dom'

const DOTS = ['#ed4199','#ff793b','#ffaa36','#70b057','#40a3d7','#b64e9f']

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#f1f4f8', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ background: '#1e2d4e', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="https://raw.githubusercontent.com/mattkepple/comms-assets/main/circlesandm.jpg" alt="Makerble" style={{ height: 36, borderRadius: 6 }} />
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Signature Generator</div>
            <div style={{ color: '#7e96b8', fontSize: 11, fontWeight: 500 }}>Powered by Makerble</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {DOTS.map((c, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
        </div>
      </header>

      {/* Hero */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560 }}>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 28 }}>
            {DOTS.map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          </div>

          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1e2d4e', lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em' }}>
            Give your whole team a<br />professional email signature
          </h1>
          <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, marginBottom: 36, fontWeight: 500 }}>
            Set up your organisation's branding once.<br />
            Share a link. Every team member generates their own signature in under a minute.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ fontSize: 14, padding: '12px 28px' }} onClick={() => navigate('/setup')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              Set up your organisation
            </button>
          </div>

          <p style={{ marginTop: 20, fontSize: 12, color: '#94a3b8' }}>
            Already set up? Your team link is <strong>signatures.makerble.com/org/your-org-name</strong>
          </p>
        </div>

        {/* Feature cards */}
        <div style={{ display: 'flex', gap: 16, marginTop: 60, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 760 }}>
          {[
            { icon: '🎨', title: 'Your branding', desc: 'Upload your logo, set your colours and default text once.' },
            { icon: '🔗', title: 'One shareable link', desc: 'Send your team a single URL — nothing to install or download.' },
            { icon: '✉️', title: 'Gmail ready', desc: 'Works in seconds with Gmail's signature paste method.' },
          ].map(f => (
            <div key={f.title} className="card" style={{ width: 220, textAlign: 'left', flexShrink: 0 }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1e2d4e', marginBottom: 5 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '16px 32px', textAlign: 'center' }}>
        <span className="makerble-badge">
          Powered by <a href="https://discover.makerble.com">Makerble</a> — CRM &amp; impact measurement for the social sector
        </span>
      </footer>
    </div>
  )
}
