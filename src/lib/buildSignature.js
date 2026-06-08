// Builds the final email-safe HTML signature string
// org = organisation config from Supabase
// person = { name, role, phone, phoneHref, email }

export function buildSignatureHTML(org, person) {
  const taglineHTML = (org.tagline || '').replace(/\n/g, '<br>')
  const brandColour = org.brand_colour || '#AC3897'

  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:'Quicksand',Arial,sans-serif;max-width:580px;width:100%;">
  <tr>
    <td style="padding:0 0 16px 0;border-bottom:1px solid #e2e8f0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr valign="top">
          <td width="78" style="padding-right:14px;padding-top:2px;" valign="top">
            <img src="${esc(org.logo_url || '')}" alt="${esc(org.name)}" width="68" style="display:block;border:0;height:auto;" />
          </td>
          <td valign="top" style="padding-right:12px;">
            <p style="margin:0 0 2px 0;font-size:17px;font-weight:700;color:#1a202c;letter-spacing:-0.01em;font-family:'Quicksand',Arial,sans-serif;">${esc(person.name)}</p>
            <p style="margin:0 0 10px 0;font-size:13px;font-weight:500;color:#64748b;font-family:'Quicksand',Arial,sans-serif;">${esc(person.role)}</p>
            <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:5px;"><tr valign="middle">
              <td width="20" valign="middle"><img src="https://raw.githubusercontent.com/mattkepple/comms-assets/main/Phone%20grey%20icon.png" alt="" width="13" height="13" style="display:block;border:0;" /></td>
              <td style="font-size:12.5px;font-weight:500;font-family:'Quicksand',Arial,sans-serif;"><a href="${esc(person.phoneHref)}" style="color:#327AB7;text-decoration:none;">${esc(person.phone)}</a></td>
            </tr></table>
            <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:5px;"><tr valign="middle">
              <td width="20" valign="middle"><img src="https://raw.githubusercontent.com/mattkepple/comms-assets/main/Envelope%20grey%20icon.png" alt="" width="13" height="13" style="display:block;border:0;" /></td>
              <td style="font-size:12.5px;font-weight:500;font-family:'Quicksand',Arial,sans-serif;"><a href="mailto:${esc(person.email)}" style="color:#327AB7;text-decoration:none;">${esc(person.email)}</a></td>
            </tr></table>
            <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:5px;"><tr valign="middle">
              <td width="20" valign="middle"><img src="https://raw.githubusercontent.com/mattkepple/comms-assets/main/Web%20grey%20icon.png" alt="" width="13" height="13" style="display:block;border:0;" /></td>
              <td style="font-size:12.5px;font-weight:500;font-family:'Quicksand',Arial,sans-serif;"><a href="${esc(org.website_url || '#')}" style="color:#327AB7;text-decoration:none;">${esc(org.website_display || org.website_url || '')}</a></td>
            </tr></table>
            ${org.tedx_href ? `<table cellpadding="0" cellspacing="0" border="0"><tr valign="middle">
              <td width="20" valign="middle"><img src="https://raw.githubusercontent.com/mattkepple/comms-assets/main/Camcorder%20grey%20icon.png" alt="" width="13" height="13" style="display:block;border:0;" /></td>
              <td style="font-size:12.5px;font-weight:500;font-family:'Quicksand',Arial,sans-serif;"><a href="${esc(org.tedx_href)}" style="color:#327AB7;text-decoration:none;">${esc(org.tedx_label || "Watch our founder's TEDx Talk")}</a></td>
            </tr></table>` : ''}
          </td>
          <td valign="bottom" align="right" style="white-space:nowrap;">
            <table cellpadding="0" cellspacing="0" border="0" align="right">
              <tr><td align="right" style="padding-bottom:10px;">
                <table cellpadding="0" cellspacing="0" border="0"><tr>
                  <td width="10"><div style="width:7px;height:7px;border-radius:50%;background:#ed4199;"></div></td>
                  <td width="10"><div style="width:7px;height:7px;border-radius:50%;background:#ff793b;"></div></td>
                  <td width="10"><div style="width:7px;height:7px;border-radius:50%;background:#ffaa36;"></div></td>
                  <td width="10"><div style="width:7px;height:7px;border-radius:50%;background:#70b057;"></div></td>
                  <td width="10"><div style="width:7px;height:7px;border-radius:50%;background:#40a3d7;"></div></td>
                  <td width="10"><div style="width:7px;height:7px;border-radius:50%;background:#b64e9f;"></div></td>
                </tr></table>
              </td></tr>
              <tr><td align="right" style="padding-bottom:10px;font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.09em;font-weight:600;font-family:'Quicksand',Arial,sans-serif;line-height:1.5;">
                ${taglineHTML}
              </td></tr>
              <tr><td align="right">
                <table cellpadding="0" cellspacing="0" border="0"><tr>
                  ${org.linkedin_url ? `<td style="padding-right:6px;"><a href="${esc(org.linkedin_url)}" style="display:block;text-decoration:none;"><img src="https://raw.githubusercontent.com/mattkepple/comms-assets/main/LinkedIn%20circle%20logo%20icon.png" alt="LinkedIn" width="28" height="28" style="display:block;border:0;" /></a></td>` : ''}
                  ${org.youtube_url ? `<td><a href="${esc(org.youtube_url)}" style="display:block;text-decoration:none;"><img src="https://raw.githubusercontent.com/mattkepple/comms-assets/main/Social%20media%20icons-04.png" alt="YouTube" width="28" height="28" style="display:block;border:0;" /></a></td>` : ''}
                </tr></table>
              </td></tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding-top:12px;padding-bottom:10px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#EAEDF1;border-radius:8px;border:1px solid #d4d8de;">
        <tr valign="top">
          <td width="36" style="padding:12px 0 12px 14px;">
            <img src="https://raw.githubusercontent.com/mattkepple/comms-assets/main/purple%20noun-friends-5250876-AC3897.png" alt="" width="17" height="17" style="display:block;margin-top:1px;border:0;" />
          </td>
          <td style="padding:12px 14px 12px 4px;font-size:12px;font-weight:500;color:#475569;line-height:1.6;font-family:'Quicksand',Arial,sans-serif;">
            <strong style="color:#1e2d4e;font-weight:700;">${esc(org.referral_text || '')}</strong> <a href="${esc(org.referral_href || '#')}" style="color:${brandColour};font-weight:600;text-decoration:none;">${esc(org.referral_link || 'Connect us here →')}</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#1e2d4e;border-radius:8px;">
        <tr valign="middle">
          <td style="padding:13px 18px;">
            <p style="margin:0 0 2px 0;font-size:13px;font-weight:700;color:#ffffff;letter-spacing:-0.01em;font-family:'Quicksand',Arial,sans-serif;">${esc(org.banner_headline || '')}</p>
            <p style="margin:0;font-size:11px;font-weight:500;color:#7e96b8;font-family:'Quicksand',Arial,sans-serif;">${esc(org.banner_sub || '')}</p>
          </td>
          <td style="padding:13px 18px 13px 0;" align="right" valign="middle">
            <a href="${esc(org.banner_href || '#')}" style="display:inline-block;background:${brandColour};border-radius:5px;padding:6px 13px;font-size:11px;font-weight:700;color:#ffffff;text-decoration:none;font-family:'Quicksand',Arial,sans-serif;white-space:nowrap;">${esc(org.banner_cta || 'Find out more →')}</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildFullPageHTML(org, person) {
  const sigHTML = buildSignatureHTML(org, person)
  const brand = org.brand_colour || '#AC3897'
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${org.name} Email Signature</title>
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  body { margin: 40px; font-family: 'Quicksand', Arial, sans-serif; background: #f1f4f8; }
  .instructions { max-width: 640px; margin-bottom: 24px; background: #1e2d4e; border-radius: 10px; padding: 16px 20px; color: #fff; }
  .instructions h2 { font-size: 14px; font-weight: 700; margin-bottom: 8px; }
  .instructions ol { padding-left: 18px; }
  .instructions li { font-size: 12px; color: #94a3b8; line-height: 1.8; }
  .instructions li strong { color: #fff; }
  .sig-wrap { max-width: 640px; background: #fff; border-radius: 10px; padding: 24px; box-shadow: 0 2px 16px rgba(0,0,0,0.08); }
  .powered { max-width: 640px; margin-top: 16px; text-align: right; font-size: 11px; color: #94a3b8; }
  .powered a { color: ${brand}; text-decoration: none; font-weight: 600; }
</style>
</head>
<body>
<div class="instructions">
  <h2>Installing your ${org.name} email signature in Gmail</h2>
  <ol>
    <li>Press <strong>Cmd+A</strong> (Mac) or <strong>Ctrl+A</strong> (Windows) to select everything on this page</li>
    <li>Press <strong>Cmd+C / Ctrl+C</strong> to copy</li>
    <li>Open <strong>Gmail → Settings → See all settings → Signature → Create new</strong></li>
    <li>Click inside the signature box and press <strong>Cmd+V / Ctrl+V</strong> to paste</li>
    <li>Scroll down and click <strong>Save Changes</strong></li>
  </ol>
</div>
<div class="sig-wrap">${sigHTML}</div>
<div class="powered">Signature powered by <a href="https://signatures.makerble.com">Makerble</a></div>
</body>
</html>`
}
