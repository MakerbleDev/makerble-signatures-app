import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

const STEPS = ['Organisation', 'Branding', 'Signature defaults', 'Done']

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label className="field-label">{label}</label>
      {children}
      {hint && <div className="hint">{hint}</div>}
    </div>
  )
}

export default function AdminPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [generatedSlug, setGeneratedSlug] = useState('')
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    passcode: '',
    logo_url: '',
    brand_colour: '#AC3897',
    website_display: '',
    website_url: '',
    linkedin_url: '',
    youtube_url: '',
    tagline: 'Change the world faster',
    referral_text: "Know a charity or social impact organisation that needs better tools? Referrals mean a lot to us - if someone you know could benefit, I'd love an introduction.",
    referral_link: 'Connect us here →',
    referral_href: '',
    banner_headline: '',
    banner_sub: 'Track outcomes · measure change · demonstrate the difference you make',
    banner_cta: 'Find out more →',
    banner_href: '',
    tedx_label: "Watch our founder's TEDx Talk",
    tedx_href: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('logos').upload(path, file, { upsert: true })
    if (error) {
      setError('Logo upload failed: ' + error.message)
    } else {
      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(path)
      set('logo_url', urlData.publicUrl)
    }
    setUploading(false)
  }

  const handleNext = async () => {
    setError('')
    if (step === 0) {
      if (!form.name.trim()) { setError('Organisation name is required'); return }
      if (!form.slug.trim()) { set('slug', slugify(form.name)); }
      setStep(1)
    } else if (step === 1) {
      if (!form.logo_url) { setError('Please upload a logo or enter a URL'); return }
      setStep(2)
    } else if (step === 2) {
      // Save to Supabase
      setSaving(true)
      const slug = form.slug || slugify(form.name)
      const payload = { ...form, slug }

      // Check slug not taken
      const { data: existing } = await supabase.from('organisations').select('id').eq('slug', slug).single()
      if (existing) {
        setError(`The URL "${slug}" is already taken — try a different organisation name or slug.`)
        setSaving(false)
        return
      }

      const { error: insertError } = await supabase.from('organisations').insert(payload)
      if (insertError) {
        setError('Save failed: ' + insertError.message)
        setSaving(false)
        return
      }
      setGeneratedSlug(slug)
      setSaving(false)
      setStep(3)
    }
  }

  const shareUrl = `${window.location.origin}/org/${generatedSlug}`

  return (
    <div style={{ minHeight: '100vh', background: '#f1f4f8' }}>
      {/* Header */}
      <header style={{ background: '#1e2d4e', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src="https://raw.githubusercontent.com/mattkepple/comms-assets/main/circlesandm.jpg" alt="Makerble" style={{ height: 32, borderRadius: 5 }} />
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Signature Generator Setup</div>
      </header>

      <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 24px' }}>

        {/* Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, gap: 0 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  background: i < step ? '#22c55e' : i === step ? '#AC3897' : '#e2e8f0',
                  color: i <= step ? '#fff' : '#94a3b8',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: i === step ? '#1e2d4e' : '#94a3b8', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: '#e2e8f0', margin: '0 8px' }} />}
            </div>
          ))}
        </div>

        <div className="card" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>

          {/* Step 0: Organisation basics */}
          {step === 0 && (
            <>
              <div className="section-heading">Your organisation</div>
              <Field label="Organisation name" hint="e.g. Shelter, Age UK, Barnardo's">
                <input className="field-input" value={form.name} onChange={e => { set('name', e.target.value); set('slug', slugify(e.target.value)) }} placeholder="Your organisation name" />
              </Field>
              <Field label="URL slug" hint={`Your team's link will be: ${window.location.origin}/org/${form.slug || 'your-org'}`}>
                <input className="field-input" value={form.slug} onChange={e => set('slug', slugify(e.target.value))} placeholder="your-org" />
              </Field>
              <Field label="Admin passcode" hint="Team members won't need this — it's only for you to edit settings later">
                <input className="field-input" type="password" value={form.passcode} onChange={e => set('passcode', e.target.value)} placeholder="Choose a passcode" />
              </Field>
            </>
          )}

          {/* Step 1: Branding */}
          {step === 1 && (
            <>
              <div className="section-heading">Branding</div>
              <Field label="Organisation logo">
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div>
                    <label className="btn btn-ghost" style={{ cursor: 'pointer', fontSize: 12 }}>
                      {uploading ? 'Uploading...' : '↑ Upload logo'}
                      <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                    </label>
                    <div className="hint" style={{ marginTop: 6 }}>PNG or JPG recommended, square or landscape</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <input className="field-input" value={form.logo_url} onChange={e => set('logo_url', e.target.value)} placeholder="Or paste an image URL" />
                  </div>
                </div>
                {form.logo_url && (
                  <div style={{ marginTop: 10 }}>
                    <img src={form.logo_url} alt="Preview" style={{ height: 48, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                  </div>
                )}
              </Field>
              <Field label="Brand colour" hint="Used for buttons and links in the signature">
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input type="color" value={form.brand_colour} onChange={e => set('brand_colour', e.target.value)} style={{ width: 48, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer', padding: 2 }} />
                  <input className="field-input" value={form.brand_colour} onChange={e => set('brand_colour', e.target.value)} style={{ width: 120 }} placeholder="#AC3897" />
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>Preview:</span>
                  <button className="btn" style={{ background: form.brand_colour, color: '#fff', padding: '6px 14px', fontSize: 12 }}>Button</button>
                </div>
              </Field>
            </>
          )}

          {/* Step 2: Signature defaults */}
          {step === 2 && (
            <>
              <div className="section-heading">Signature defaults — team members can personalise their own copy</div>
              <Field label="Website (display text)"><input className="field-input" value={form.website_display} onChange={e => set('website_display', e.target.value)} placeholder="e.g. shelter.org.uk" /></Field>
              <Field label="Website URL"><input className="field-input" value={form.website_url} onChange={e => set('website_url', e.target.value)} placeholder="https://shelter.org.uk" /></Field>
              <Field label="LinkedIn URL"><input className="field-input" value={form.linkedin_url} onChange={e => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/company/..." /></Field>
              <Field label="YouTube URL"><input className="field-input" value={form.youtube_url} onChange={e => set('youtube_url', e.target.value)} placeholder="https://youtube.com/..." /></Field>
              <Field label="Tagline" hint="Short — appears in the top right of the signature">
                <textarea className="field-input" rows={2} value={form.tagline} onChange={e => set('tagline', e.target.value)} />
              </Field>
              <Field label="Referral message">
                <textarea className="field-input" rows={3} value={form.referral_text} onChange={e => set('referral_text', e.target.value)} />
              </Field>
              <Field label="Referral link label"><input className="field-input" value={form.referral_link} onChange={e => set('referral_link', e.target.value)} /></Field>
              <Field label="Referral link URL"><input className="field-input" value={form.referral_href} onChange={e => set('referral_href', e.target.value)} placeholder="mailto:hello@yourorg.com" /></Field>
              <Field label="Banner headline"><input className="field-input" value={form.banner_headline} onChange={e => set('banner_headline', e.target.value)} placeholder="Your organisation — one line description" /></Field>
              <Field label="Banner subline"><input className="field-input" value={form.banner_sub} onChange={e => set('banner_sub', e.target.value)} /></Field>
              <Field label="Banner button label"><input className="field-input" value={form.banner_cta} onChange={e => set('banner_cta', e.target.value)} /></Field>
              <Field label="Banner button URL"><input className="field-input" value={form.banner_href} onChange={e => set('banner_href', e.target.value)} placeholder="https://yourorg.com" /></Field>
              <Field label="TEDx / video label" hint="Leave URL blank to hide this row in the signature">
                <input className="field-input" value={form.tedx_label} onChange={e => set('tedx_label', e.target.value)} style={{ marginBottom: 6 }} />
                <input className="field-input" value={form.tedx_href} onChange={e => set('tedx_href', e.target.value)} placeholder="https://youtube.com/watch?v=..." />
              </Field>
            </>
          )}

          {/* Step 3: Done */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e2d4e', marginBottom: 8 }}>You're all set!</h2>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>
                Share this link with your team. They'll see your branding pre-loaded and just need to fill in their own name, role, phone and email.
              </p>
              <div style={{ background: '#f1f4f8', borderRadius: 8, padding: '14px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#1e2d4e', wordBreak: 'break-all' }}>{shareUrl}</span>
                <button className="btn btn-primary" style={{ flexShrink: 0, fontSize: 12, padding: '7px 14px' }}
                  onClick={() => { navigator.clipboard.writeText(shareUrl) }}>
                  Copy link
                </button>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button className="btn btn-navy" onClick={() => navigate(`/org/${generatedSlug}`)}>
                  Preview your generator →
                </button>
              </div>
              <p style={{ marginTop: 20, fontSize: 11, color: '#94a3b8' }}>
                Save your passcode somewhere safe — you'll need it to edit these settings later.
              </p>
            </div>
          )}

          {/* Error */}
          {error && <div style={{ marginTop: 12, padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 12, color: '#dc2626' }}>{error}</div>}

          {/* Navigation */}
          {step < 3 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
              {step > 0
                ? <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>← Back</button>
                : <div />
              }
              <button className="btn btn-primary" onClick={handleNext} disabled={saving}>
                {saving ? 'Saving...' : step === 2 ? 'Create my signature page →' : 'Continue →'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <span className="makerble-badge">Powered by <a href="https://discover.makerble.com">Makerble</a></span>
        </div>
      </div>
    </div>
  )
}
