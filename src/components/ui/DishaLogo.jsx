// // Disha Academy — Final Approved Logo Component
// // Full horizontal light + dark variants

// export function DishaLogoFull({ dark = false, width = 320 }) {
//   const height = Math.round(width * (80 / 360))
//   const scale = width / 360

//   return (
//     <svg
//       width={width}
//       height={height}
//       viewBox="0 0 360 80"
//       xmlns="http://www.w3.org/2000/svg"
//       style={{ display: 'block' }}
//     >
//       <defs>
//         <path id="topArc" d="M 10,40 A 28,28 0 0,1 68,38" fill="none" />
//         <path id="botArc" d="M 13,50 A 25,25.5 0 0,0 67,44" fill="none" />
//       </defs>

//       {/* ── BADGE: gold ring → white gap → navy ── */}
//       <circle cx="40" cy="40" r="39" fill="#c9a227" />
//       <circle cx="40" cy="40" r="36.5" fill={dark ? '#0d1b3e' : '#ffffff'} />
//       <circle cx="40" cy="40" r="35" fill="#1e3a8a" />
//       <circle cx="40" cy="40" r="28" fill="none" stroke="#f5c842" strokeWidth="0.9" />

//       {/* Compass spokes */}
//       <line x1="40" y1="13" x2="40" y2="67" stroke="#f5c842" strokeWidth="0.6" opacity="0.22" />
//       <line x1="13" y1="40" x2="67" y2="40" stroke="#f5c842" strokeWidth="0.6" opacity="0.22" />
//       <line x1="19" y1="19" x2="61" y2="61" stroke="#f5c842" strokeWidth="0.5" opacity="0.13" />
//       <line x1="61" y1="19" x2="19" y2="61" stroke="#f5c842" strokeWidth="0.5" opacity="0.13" />

//       {/* Open Book — left page */}
//       <path d="M 23,57 L 23,47 Q 23,44 26,43 L 40,41 L 40,60 Q 33,58 27,60 Q 23,60 23,57 Z" fill="#f5c842" />
//       {/* Open Book — right page */}
//       <path d="M 42,41 L 56,43 Q 59,44 59,47 L 59,57 Q 59,60 56,60 Q 50,58 42,60 Z" fill="#f5c842" opacity="0.62" />
//       {/* Spine */}
//       <line x1="41" y1="41" x2="41" y2="60" stroke="#1e3a8a" strokeWidth="2" />
//       {/* Page lines left */}
//       <line x1="26" y1="49" x2="39" y2="47" stroke="#1e3a8a" strokeWidth="0.9" opacity="0.4" />
//       <line x1="26" y1="52" x2="39" y2="50" stroke="#1e3a8a" strokeWidth="0.9" opacity="0.4" />
//       <line x1="26" y1="55" x2="39" y2="53" stroke="#1e3a8a" strokeWidth="0.9" opacity="0.4" />

//       {/* Compass needle North — gold */}
//       <polygon points="41,15 44.5,31 41,28 37.5,31" fill="#f5c842" />
//       {/* Compass needle South — white dim */}
//       <polygon points="41,50 37.5,34 41,37 44.5,34" fill="#ffffff" opacity="0.45" />
//       {/* Center pivot */}
//       <circle cx="41" cy="32" r="2.6" fill="#ffffff" stroke="#f5c842" strokeWidth="1.2" />

//       {/* Curved text — DISHA ACADEMY top */}
//       <text fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="5.9" fill="#f5c842" letterSpacing="1.7">
//         <textPath href="#topArc" startOffset="8.5%">DISHA  ACADEMY</textPath>
//       </text>
//       {/* Curved text — · CLASSES · bottom */}
//       <text fontFamily="Arial,sans-serif" fontWeight="750" fontSize="5" fill="#f5c842" letterSpacing="1.6" opacity="1.8">
//         <textPath href="#botArc" startOffset="18.5%">· CLASSES ·</textPath>
//       </text>

//       {/* ── DIVIDER ── */}
//       <line x1="90" y1="10" x2="90" y2="70" stroke={dark ? '#f5c842' : '#1e3a8a'} strokeWidth="0.9" opacity="0.4" />

//       {/* ── DISHA ACADEMY TEXT ── */}
//       <text x="95" y="31" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="24" fill={dark ? '#f5c842' : '#1e3a8a'} letterSpacing="-0.5">DISHA</text>
//       <text x="95" y="57" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="24" fill={dark ? '#ffffff' : '#1e3a8a'} letterSpacing="-0.5">ACADEMY</text>

//       {/* ── RIGHT DIVIDER ── */}
//       <line x1="228" y1="14" x2="228" y2="66" stroke={dark ? '#f5c842' : '#1e3a8a'} strokeWidth="0.7" opacity="0.5" />

//       {/* ── TAGLINES ── */}
//       <text x="237" y="29" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="8.5" fill={dark ? '#94a3b8' : '#64748b'} letterSpacing="1">SSC · POLICE</text>
//       <text x="237" y="43" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="8.5" fill={dark ? '#94a3b8' : '#64748b'} letterSpacing="1">RAILWAY · DSSSB</text>
//       <text x="237" y="57" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="8.5" fill={dark ? '#94a3b8' : '#64748b'} letterSpacing="1">GTB NAGAR, DELHI</text>
//     </svg>
//   )
// }

// // Icon only (for navbar, favicon etc)
// export function DishaLogoIcon({ size = 40 }) {
//   return (
//     <svg width={size} height={size} viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg">
//       <defs>
//         <path id="iconTop" d="M 10,42 A 32,32 0 0,1 74,42" fill="none" />
//         <path id="iconBot" d="M 13,53 A 29,29 0 0,0 71,53" fill="none" />
//       </defs>
//       <circle cx="42" cy="42" r="41" fill="#c9a227" />
//       <circle cx="42" cy="42" r="38.5" fill="#ffffff" />
//       <circle cx="42" cy="42" r="37" fill="#1e3a8a" />
//       <circle cx="42" cy="42" r="30" fill="none" stroke="#f5c842" strokeWidth="1" />
//       <line x1="42" y1="13" x2="42" y2="71" stroke="#f5c842" strokeWidth="0.7" opacity="0.22" />
//       <line x1="13" y1="42" x2="71" y2="42" stroke="#f5c842" strokeWidth="0.7" opacity="0.22" />
//       <line x1="20" y1="20" x2="64" y2="64" stroke="#f5c842" strokeWidth="0.6" opacity="0.13" />
//       <line x1="64" y1="20" x2="20" y2="64" stroke="#f5c842" strokeWidth="0.6" opacity="0.13" />
//       <path d="M 23,58 L 23,48 Q 23,45 27,44 L 41,42 L 41,62 Q 33,60 27,62 Q 23,62 23,59 Z" fill="#f5c842" />
//       <path d="M 43,42 L 57,44 Q 61,45 61,48 L 61,59 Q 61,62 57,62 Q 51,60 43,62 Z" fill="#f5c842" opacity="0.62" />
//       <line x1="42" y1="42" x2="42" y2="62" stroke="#1e3a8a" strokeWidth="2.2" />
//       <line x1="27" y1="50" x2="40" y2="48" stroke="#1e3a8a" strokeWidth="1" opacity="0.4" />
//       <line x1="27" y1="53" x2="40" y2="51" stroke="#1e3a8a" strokeWidth="1" opacity="0.4" />
//       <line x1="27" y1="56" x2="40" y2="54" stroke="#1e3a8a" strokeWidth="1" opacity="0.4" />
//       <polygon points="42,15 45.5,33 42,30 38.5,33" fill="#f5c842" />
//       <polygon points="42,52 38.5,34 42,37 45.5,34" fill="#ffffff" opacity="0.45" />
//       <circle cx="42" cy="33" r="3" fill="#ffffff" stroke="#f5c842" strokeWidth="1.3" />
//       <text fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="6.5" fill="#f5c842" letterSpacing="1.8">
//         <textPath href="#iconTop" startOffset="6%">DISHA  ACADEMY</textPath>
//       </text>
//       <text fontFamily="Arial,sans-serif" fontWeight="700" fontSize="6" fill="#f5c842" letterSpacing="2.5" opacity="0.9">
//         <textPath href="#iconBot" startOffset="21%">· CLASSES ·</textPath>
//       </text>
//     </svg>
//   )
// }

// // Default export — navbar use karo
// export default function DishaLogo({ dark = false, compact = false, size }) {
//   if (compact) return <DishaLogoIcon size={size || 36} />
//   return <DishaLogoFull dark={dark} width={size || 260} />
// }


// Disha Academy — Final Approved Logo Component
// Full horizontal light + dark variants

export function DishaLogoFull({ dark = false, width = 320 }) {
  const height = Math.round(width * (80 / 360))
  const scale = width / 360

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 360 80"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <defs>
        <path id="topArc" d="M 10,40 A 28,28 0 0,1 68,38" fill="none" />
        <path id="botArc" d="M 13,50 A 25,25.5 0 0,0 67,44" fill="none" />
      </defs>

      {/* ── BADGE: gold ring → white gap → navy ── */}
      <circle cx="40" cy="40" r="39" fill="#c9a227" />
      <circle cx="40" cy="40" r="36.5" fill={dark ? '#0d1b3e' : '#ffffff'} />
      <circle cx="40" cy="40" r="35" fill="#1e3a8a" />
      <circle cx="40" cy="40" r="28" fill="none" stroke="#f5c842" strokeWidth="0.9" />

      {/* Compass spokes */}
      <line x1="40" y1="13" x2="40" y2="67" stroke="#f5c842" strokeWidth="0.6" opacity="0.22" />
      <line x1="13" y1="40" x2="67" y2="40" stroke="#f5c842" strokeWidth="0.6" opacity="0.22" />
      <line x1="19" y1="19" x2="61" y2="61" stroke="#f5c842" strokeWidth="0.5" opacity="0.13" />
      <line x1="61" y1="19" x2="19" y2="61" stroke="#f5c842" strokeWidth="0.5" opacity="0.13" />

      {/* Open Book — left page */}
      <path d="M 23,57 L 23,47 Q 23,44 26,43 L 40,41 L 40,60 Q 33,58 27,60 Q 23,60 23,57 Z" fill="#f5c842" />
      {/* Open Book — right page */}
      <path d="M 42,41 L 56,43 Q 59,44 59,47 L 59,57 Q 59,60 56,60 Q 50,58 42,60 Z" fill="#f5c842" opacity="0.62" />
      {/* Spine */}
      <line x1="41" y1="41" x2="41" y2="60" stroke="#1e3a8a" strokeWidth="2" />
      {/* Page lines left */}
      <line x1="26" y1="49" x2="39" y2="47" stroke="#1e3a8a" strokeWidth="0.9" opacity="0.4" />
      <line x1="26" y1="52" x2="39" y2="50" stroke="#1e3a8a" strokeWidth="0.9" opacity="0.4" />
      <line x1="26" y1="55" x2="39" y2="53" stroke="#1e3a8a" strokeWidth="0.9" opacity="0.4" />

      {/* Compass needle North — gold */}
      <polygon points="41,15 44.5,31 41,28 37.5,31" fill="#f5c842" />
      {/* Compass needle South — white dim */}
      <polygon points="41,50 37.5,34 41,37 44.5,34" fill="#ffffff" opacity="0.45" />
      {/* Center pivot */}
      <circle cx="41" cy="32" r="2.6" fill="#ffffff" stroke="#f5c842" strokeWidth="1.2" />

      {/* Curved text — DISHA ACADEMY top */}
      <text fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="5.9" fill="#f5c842" letterSpacing="1.7">
        <textPath href="#topArc" startOffset="8.5%">DISHA  ACADEMY</textPath>
      </text>
      {/* Curved text — · CLASSES · bottom */}
      <text fontFamily="Arial,sans-serif" fontWeight="750" fontSize="5" fill="#f5c842" letterSpacing="1.6" opacity="1.8">
        <textPath href="#botArc" startOffset="18.5%">· CLASSES ·</textPath>
      </text>

      {/* ── DIVIDER ── */}
      <line x1="90" y1="10" x2="90" y2="70" stroke={dark ? '#f5c842' : '#1e3a8a'} strokeWidth="0.9" opacity="0.4" />

      {/* ── DISHA ACADEMY TEXT ── */}
      <text x="95" y="31" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="24" fill="#f5c842" letterSpacing="-0.5">DISHA</text>
      <text x="95" y="57" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="24" fill={dark ? '#ffffff' : '#1e3a8a'} letterSpacing="-0.5">ACADEMY</text>

      {/* ── RIGHT DIVIDER ── */}
      <line x1="228" y1="14" x2="228" y2="66" stroke={dark ? '#f5c842' : '#1e3a8a'} strokeWidth="0.7" opacity="0.5" />

      {/* ── TAGLINES ── */}
      <text x="237" y="29" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="8.5" fill={dark ? '#94a3b8' : '#64748b'} letterSpacing="1">SSC · POLICE</text>
      <text x="237" y="43" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="8.5" fill={dark ? '#94a3b8' : '#64748b'} letterSpacing="1">RAILWAY · DSSSB</text>
      <text x="237" y="57" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="8.5" fill={dark ? '#94a3b8' : '#64748b'} letterSpacing="1">GTB NAGAR, DELHI</text>
    </svg>
  )
}

// Icon only (for navbar, favicon etc)
export function DishaLogoIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <path id="iconTop" d="M 10,42 A 32,32 0 0,1 74,42" fill="none" />
        <path id="iconBot" d="M 13,53 A 29,29 0 0,0 71,53" fill="none" />
      </defs>
      <circle cx="42" cy="42" r="41" fill="#c9a227" />
      <circle cx="42" cy="42" r="38.5" fill="#ffffff" />
      <circle cx="42" cy="42" r="37" fill="#1e3a8a" />
      <circle cx="42" cy="42" r="30" fill="none" stroke="#f5c842" strokeWidth="1" />
      <line x1="42" y1="13" x2="42" y2="71" stroke="#f5c842" strokeWidth="0.7" opacity="0.22" />
      <line x1="13" y1="42" x2="71" y2="42" stroke="#f5c842" strokeWidth="0.7" opacity="0.22" />
      <line x1="20" y1="20" x2="64" y2="64" stroke="#f5c842" strokeWidth="0.6" opacity="0.13" />
      <line x1="64" y1="20" x2="20" y2="64" stroke="#f5c842" strokeWidth="0.6" opacity="0.13" />
      <path d="M 23,58 L 23,48 Q 23,45 27,44 L 41,42 L 41,62 Q 33,60 27,62 Q 23,62 23,59 Z" fill="#f5c842" />
      <path d="M 43,42 L 57,44 Q 61,45 61,48 L 61,59 Q 61,62 57,62 Q 51,60 43,62 Z" fill="#f5c842" opacity="0.62" />
      <line x1="42" y1="42" x2="42" y2="62" stroke="#1e3a8a" strokeWidth="2.2" />
      <line x1="27" y1="50" x2="40" y2="48" stroke="#1e3a8a" strokeWidth="1" opacity="0.4" />
      <line x1="27" y1="53" x2="40" y2="51" stroke="#1e3a8a" strokeWidth="1" opacity="0.4" />
      <line x1="27" y1="56" x2="40" y2="54" stroke="#1e3a8a" strokeWidth="1" opacity="0.4" />
      <polygon points="42,15 45.5,33 42,30 38.5,33" fill="#f5c842" />
      <polygon points="42,52 38.5,34 42,37 45.5,34" fill="#ffffff" opacity="0.45" />
      <circle cx="42" cy="33" r="3" fill="#ffffff" stroke="#f5c842" strokeWidth="1.3" />
      <text fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="6.5" fill="#f5c842" letterSpacing="1.8">
        <textPath href="#iconTop" startOffset="6%">DISHA  ACADEMY</textPath>
      </text>
      <text fontFamily="Arial,sans-serif" fontWeight="700" fontSize="6" fill="#f5c842" letterSpacing="2.5" opacity="0.9">
        <textPath href="#iconBot" startOffset="21%">· CLASSES ·</textPath>
      </text>
    </svg>
  )
}

// Default export — navbar use karo
export default function DishaLogo({ dark = false, compact = false, size }) {
  if (compact) return <DishaLogoIcon size={size || 36} />
  return <DishaLogoFull dark={dark} width={size || 260} />
}
