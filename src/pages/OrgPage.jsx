import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { buildSignatureHTML, buildFullPageHTML } from '../lib/buildSignature.js'

const SECTIONS = ['Your details', 'Contact', 'Customise']

export default function OrgPage() {
  const { slug } = useParams()
  const [org, setOrg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const [previewCopied, setPreviewCopied] = useState(false)

  const [person, setPerson] = useState({
    name: '',
    role: '',
    phone: '',
    phoneHref: '',
    email: '',
  })

  // Per-person overrides (optional)
  const [overrides, setOverrides] = useState({
    tagline: '',
    referral_text: '',
    referral_href: '',
    banner_headline: '',
    banner_sub: '',
    banner_cta: '',
    banner_href: '',
  })

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('organisations')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error || !data) {
        setNotFound(true)
      } else {
        setOrg(data)
        // Pre-populate overrides with org defaults
        setOverrides({
          tagline: data.tagline || '',
          referral_text: data.referral_text || '',
          referral_href: data.referral_href || '',
          banner_headline: data.banner_headline || '',
          banner_sub: data.banner_sub || '',
          banner_cta: data.banner_cta || '',
          banner_href: data.banner_href || '',
        })
      }
      setLoading(false)
    }
    load()
  }, [slug])

  const setP = (k, v) => setPerson(p => ({ ...p, [k]: v }))
  const setO = (k, v) => setOverrides(o => ({ ...o, [k]: v }))

  // Merge org config with per-person overrides
  const mergedOrg = org ? { ...org, ...Object.fromEntries(Object.entries(overrides).filter(([, v]) => v !== '')) } : null

  const launchPreview = () => {
    if (!mergedOrg) return
    const html = buildFullPageHTML(mergedOrg, person)
    const blob = new Blob([html], { type: 'text/html' })
    window.open(URL.createObjectURL(blob), '_blank')
  }

  const download = () => {
    if (!mergedOrg) return
    const html = buildFullPageHTML(mergedOrg, person)
    const name = person.name ? person.name.toLowerCase().replace(/\s+/g, '-') : 'signature'
    const blob = new Blob([html], { type: 'text/html' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${slug}-signature-${name}.html`
    a.click()
  }

  const brand = org?.brand_colour || '#AC3897'

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 14 }}>
      Loading…
    </div>
  )

  if (notFound) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40, textAlign: 'center' }}>
      <div style={{ fontSize: 40 }}>🔍</div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1e2d4e' }}>Organisation not found</h1>
      <p style={{ fontSize: 14, color: '#64748b' }}>The link <strong>/org/{slug}</strong> doesn't match any organisation we have on file. Check the URL or ask your administrator.</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f1f4f8', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ background: '#1e2d4e', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={org.logo_url} alt={org.name} style={{ height: 34, width: 'auto', borderRadius: 5 }} onError={e => e.target.style.display='none'} />
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{org.name} — Signature Generator</div>
            <div style={{ color: '#7e96b8', fontSize: 11, fontWeight: 500 }}>Fill in your details and download your signature</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" style={{ background: '#327AB7', color: '#fff', fontSize: 12, padding: '8px 14px' }} onClick={launchPreview}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Launch preview
          </button>
          <button className="btn" style={{ background: brand, color: '#fff', fontSize: 12, padding: '8px 14px' }} onClick={download}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left panel */}
        <div style={{ width: 300, flexShrink: 0, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>

          {/* Section tabs */}
          <div style={{ padding: '10px 12px 0', borderBottom: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {SECTIONS.map((s, i) => (
              <button key={s} onClick={() => setActiveSection(i)} style={{
                background: activeSection === i ? '#1e2d4e' : 'transparent',
                color: activeSection === i ? '#fff' : '#64748b',
                border: activeSection === i ? 'none' : '1px solid #e2e8f0',
                borderRadius: 5, padding: '5px 10px', fontSize: 11, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', marginBottom: 8,
              }}>{s}</button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>

            {activeSection === 0 && (
              <>
                <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 14, lineHeight: 1.5 }}>
                  These are the only fields you need to fill in — everything else is pre-set for {org.name}.
                </p>
                {[
                  { key: 'name', label: 'Full name', placeholder: 'e.g. Jane Smith' },
                  { key: 'role', label: 'Job title', placeholder: 'e.g. Fundraising Manager' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 14 }}>
                    <label className="field-label">{f.label}</label>
                    <input className="field-input" value={person[f.key]} onChange={e => setP(f.key, e.target.value)} placeholder={f.placeholder} />
                  </div>
                ))}
              </>
            )}

            {activeSection === 1 && (
              <>
                {[
                  { key: 'phone', label: 'Phone (display)', placeholder: '+44 (0)20 1234 5678' },
                  { key: 'phoneHref', label: 'Phone (href)', placeholder: 'tel:+442012345678', hint: 'Starts with tel:' },
                  { key: 'email', label: 'Email address', placeholder: 'jane.smith@yourorg.com' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 14 }}>
                    <label className="field-label">{f.label}</label>
                    <input className="field-input" value={person[f.key]} onChange={e => setP(f.key, e.target.value)} placeholder={f.placeholder} />
                    {f.hint && <div className="hint">{f.hint}</div>}
                  </div>
                ))}
              </>
            )}

            {activeSection === 2 && (
              <>
                <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 14, lineHeight: 1.5 }}>
                  Optional — these are pre-set by your admin. Only change if you need something different.
                </p>
                {[
                  { key: 'tagline', label: 'Tagline', textarea: true },
                  { key: 'referral_text', label: 'Referral message', textarea: true },
                  { key: 'banner_headline', label: 'Banner headline' },
                  { key: 'banner_sub', label: 'Banner subline' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 14 }}>
                    <label className="field-label">{f.label}</label>
                    {f.textarea
                      ? <textarea className="field-input" rows={3} value={overrides[f.key]} onChange={e => setO(f.key, e.target.value)} />
                      : <input className="field-input" value={overrides[f.key]} onChange={e => setO(f.key, e.target.value)} />
                    }
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Reset */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0' }}>
            <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: 11 }}
              onClick={() => { setPerson({ name:'', role:'', phone:'', phoneHref:'', email:'' }); setActiveSection(0) }}>
              Reset my details
            </button>
          </div>
        </div>

        {/* Right: live preview */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Live preview</span>
            <span style={{ fontSize: 11, color: '#cbd5e1' }}>Updates as you type</span>
          </div>

          {/* Email chrome */}
          <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', overflow: 'hidden', maxWidth: 680 }}>
            <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '10px 16px' }}>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 5 }}>From: {person.email || 'your.email@' + slug + '.org'}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 5 }}>To: recipient@example.com</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a202c' }}>Subject: Your email subject here</div>
            </div>
            <div style={{ padding: '20px 20px 8px' }}>
              <p style={{ fontSize: 13, color: '#475569', marginBottom: 20, lineHeight: 1.6 }}>
                Hi there,<br /><br />Your email body goes here...<br /><br />Kind regards,
              </p>
              {mergedOrg && (
                <div dangerouslySetInnerHTML={{ __html: buildSignatureHTML(mergedOrg, person) }} style={{ maxWidth: 580 }} />
              )}
            </div>
          </div>

          {/* Install guide */}
          <div style={{ marginTop: 20, background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: '16px 20px', maxWidth: 680 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1e2d4e', marginBottom: 10 }}>How to install in Gmail</div>
            {[
              'Fill in your name, job title, phone and email on the left',
              'Click "Launch preview" to open your signature in a new tab, or "Download" to save it',
              'In that tab: press Cmd+A (Mac) or Ctrl+A (Windows), then Cmd+C / Ctrl+C to copy',
              'Open Gmail → Settings → See all settings → Signature → Create new',
              'Click inside the signature box, paste (Cmd+V / Ctrl+V), then Save Changes',
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 7, alignItems: 'flex-start' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: brand, color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{s}</div>
              </div>
            ))}
          </div>

          {/* Powered by */}
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <span className="makerble-badge">Signature tool powered by <a href="https://discover.makerble.com">Makerble</a></span>
          </div>
        </div>
      </div>
    </div>
  )
}
