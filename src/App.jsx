import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from './lib/supabase'

/* ───── styles object (inline CSS to keep single-file) ───── */
const S = {
  page: { minHeight: '100vh', background: '#0a0a0a', color: '#d4af37', fontFamily: "'Segoe UI',system-ui,sans-serif" },
  hdr: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid #1a1a1a', background: '#0d0d0d' },
  logo: { fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.15em', color: '#d4af37', textDecoration: 'none' },
  nav: { display: 'flex', gap: '1rem', alignItems: 'center' },
  navLink: { color: '#b0b0b0', textDecoration: 'none', fontSize: '0.85rem', padding: '0.4rem 0.6rem', borderRadius: 4 },
  btn: { background: '#d4af37', color: '#0a0a0a', border: 'none', padding: '0.5rem 1.2rem', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' },
  btnOut: { background: 'transparent', color: '#d4af37', border: '1px solid #d4af37', padding: '0.5rem 1.2rem', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' },
  card: { background: '#111', border: '1px solid #1a1a1a', borderRadius: 8, padding: '1.5rem', margin: '1rem 0' },
  input: { width: '100%', padding: '0.6rem', background: '#0a0a0a', border: '1px solid #333', color: '#d4af37', borderRadius: 4, marginBottom: '0.8rem', boxSizing: 'border-box' },
  section: { maxWidth: 900, margin: '2rem auto', padding: '0 1rem' },
  h1: { fontSize: '1.8rem', fontWeight: 700, color: '#d4af37', marginBottom: '0.5rem' },
  h2: { fontSize: '1.3rem', fontWeight: 600, color: '#d4af37', marginBottom: '0.5rem' },
  p: { color: '#999', lineHeight: 1.6, fontSize: '0.9rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', margin: '1rem 0' },
  priceCard: { background: '#111', border: '1px solid #1a1a1a', borderRadius: 8, padding: '1.2rem', textAlign: 'center' },
  price: { fontSize: '1.5rem', fontWeight: 700, color: '#d4af37', margin: '0.3rem 0' },
  comingSoon: { textAlign: 'center', padding: '4rem 1rem', background: '#111', border: '1px solid #1a1a1a', borderRadius: 8, margin: '2rem 0' },
  roleBadge: { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600, background: '#1a1a1a', color: '#d4af37', border: '1px solid #333' },
  adminToggle: { marginTop: '0.5rem', background: '#1a0a00', border: '1px solid #d4af37', color: '#d4af37', padding: '0.3rem 0.8rem', borderRadius: 4, cursor: 'pointer', fontSize: '0.8rem' },
  footer: { textAlign: 'center', padding: '2rem', color: '#444', fontSize: '0.8rem', borderTop: '1px solid #1a1a1a', marginTop: '3rem' }
}

/* ───── AuthPages ───── */
function AuthPages() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleAuth(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setError('Check your email for the confirmation link.')
      }
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  return (
    &lt;div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}&gt;
      &lt;div style={{ ...S.card, width: 380, maxWidth: '90vw' }}&gt;
        &lt;h1 style={{ ...S.h1, textAlign: 'center', marginBottom: '1.5rem' }}&gt;GOLDEN ELITE&lt;/h1&gt;
        &lt;button style={{ ...S.btnOut, width: '100%', marginBottom: '1rem' }} onClick={() =&gt; setMode(mode === 'login' ? 'signup' : 'login')}&gt;
          {mode === 'login' ? 'Create an account' : 'Already have an account? Sign in'}
        &lt;/button&gt;
        &lt;form onSubmit={handleAuth}&gt;
          &lt;input style={S.input} type="email" placeholder="Email" value={email} onChange={e =&gt; setEmail(e.target.value)} required /&gt;
          &lt;input style={S.input} type="password" placeholder="Password" value={password} onChange={e =&gt; setPassword(e.target.value)} required /&gt;
          &lt;button style={{ ...S.btn, width: '100%' }} disabled={loading}&gt;{loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Sign Up'}&lt;/button&gt;
        &lt;/form&gt;
        {error &amp;&amp; &lt;p style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}&gt;{error}&lt;/p&gt;}
      &lt;/div&gt;
    &lt;/div&gt;
  )
}

/* ───── Protected Shell ───── */
function AppShell() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('member')  // member | lister | admin
  const [adminMode, setAdminMode] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user) } else { navigate('/login') }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_ev, s) => {
      if (s?.user) { setUser(s.user) } else { navigate('/login') }
    })
    return () => subscription.unsubscribe()
  }, [navigate])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      try {
        const { data } = await supabase.from('admin_users').select('active').eq('user_id', user.id).maybeSingle()
        setRole(data?.active ? 'admin' : 'member')
      } catch { setRole('member') }
    })()
  }, [user])

  function handleSignOut() {
    supabase.auth.signOut().then(() => navigate('/login'))
  }

  const showAdmin = role === 'admin' || adminMode

  const navItems = [
    { path: '/feed', label: 'Elite Feed' },
    { path: '/discover', label: 'Discover Listers' },
    { path: '/member', label: 'Member Dashboard' },
    ...(role === 'admin' || adminMode ? [{ path: '/admin', label: 'Admin Dashboard' }] : []),
  ]

  return (
    &lt;div style={S.page}&gt;
      &lt;header style={S.hdr}&gt;
        &lt;Link to="/feed" style={S.logo}&gt;GOLDEN ELITE&lt;/Link&gt;
        &lt;nav style={S.nav}&gt;
          {navItems.map(n =&gt; (
            &lt;Link key={n.path} to={n.path} style={{ ...S.navLink, ...(location.pathname === n.path ? { color: '#d4af37' } : {}) }}&gt;{n.label}&lt;/Link&gt;
          ))}
          {showAdmin &amp;&amp; role !== 'admin' &amp;&amp; (
            &lt;button style={S.adminToggle} onClick={() =&gt; setAdminMode(!adminMode)}&gt;
              {adminMode ? 'Leave Preview' : 'Admin Preview'}
            &lt;/button&gt;
          )}
          &lt;span style={{ ...S.roleBadge, marginRight: '0.5rem' }}&gt;{role === 'admin' ? 'Admin' : role === 'lister' ? 'Lister' : 'Member'}&lt;/span&gt;
          &lt;button style={S.btnOut} onClick={handleSignOut}&gt;Sign Out&lt;/button&gt;
        &lt;/nav&gt;
      &lt;/header&gt;
      &lt;Routes&gt;
        &lt;Route path="/feed" element={&lt;FeedPage /&gt;} /&gt;
        &lt;Route path="/discover" element={&lt;DiscoverPage /&gt;} /&gt;
        &lt;Route path="/lister/:id" element={&lt;ListerProfilePage /&gt;} /&gt;
        &lt;Route path="/member" element={&lt;MemberDashboard /&gt;} /&gt;
        &lt;Route path="/lister" element={&lt;ListerDashboard /&gt;} /&gt;
        &lt;Route path="/admin" element={&lt;AdminDashboard /&gt;} /&gt;
        &lt;Route path="/red-door" element={&lt;ComingSoonPage title="Red Door Room" /&gt;} /&gt;
        &lt;Route path="*" element={&lt;Navigate to="/feed" /&gt;} /&gt;
      &lt;/Routes&gt;
      &lt;footer style={S.footer}&gt;&amp;copy; {new Date().getFullYear()} GOLDEN ELITE — Private Platform&lt;/footer&gt;
    &lt;/div&gt;
  )
}

/* ───── Pages ───── */
function FeedPage() {
  return (
    &lt;div style={S.section}&gt;
      &lt;h1 style={S.h1}&gt;Elite Feed&lt;/h1&gt;
      &lt;div style={S.card}&gt;
        &lt;p style={S.p}&gt;Welcome to your Elite Feed. Browse exclusive content and connect with the community.&lt;/p&gt;
        &lt;p style={{ ...S.p, marginTop: '0.5rem', fontStyle: 'italic' }}&gt;No content available yet.&lt;/p&gt;
      &lt;/div&gt;
      &lt;div style={S.comingSoon}&gt;
        &lt;h2 style={S.h2}&gt;Red Door Room&lt;/h2&gt;
        &lt;p style={{ color: '#666' }}&gt;COMING SOON&lt;/p&gt;
        &lt;p style={S.p}&gt;A premium experience is on its way. Stay tuned.&lt;/p&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  )
}

function DiscoverPage() {
  return (
    &lt;div style={S.section}&gt;
      &lt;h1 style={S.h1}&gt;Discover Elite Listers&lt;/h1&gt;
      &lt;div style={S.card}&gt;
        &lt;p style={S.p}&gt;Browse verified Elite Listers in the community.&lt;/p&gt;
        &lt;p style={{ ...S.p, fontStyle: 'italic', marginTop: '0.5rem' }}&gt;No listers available yet.&lt;/p&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  )
}

function ListerProfilePage() {
  const { id } = { id: 'lister-001' }
  return (
    &lt;div style={S.section}&gt;
      &lt;h1 style={S.h1}&gt;Lister Profile&lt;/h1&gt;
      &lt;div style={S.card}&gt;
        &lt;p style={S.p}&gt;Profile page for Lister {id}.&lt;/p&gt;
        &lt;p style={{ ...S.p, fontStyle: 'italic', marginTop: '0.5rem' }}&gt;Profile details will appear when data is available.&lt;/p&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  )
}

function MemberDashboard() {
  return (
    &lt;div style={S.section}&gt;
      &lt;h1 style={S.h1}&gt;Member Dashboard&lt;/h1&gt;
      &lt;div style={S.card}&gt;
        &lt;h2 style={S.h2}&gt;Membership Prices&lt;/h2&gt;
        &lt;div style={S.grid}&gt;
          &lt;div style={S.priceCard}&gt;&lt;p style={{ color: '#888', fontSize: '0.8rem' }}&gt;Daily&lt;/p&gt;&lt;p style={S.price}&gt;R39&lt;/p&gt;&lt;/div&gt;
          &lt;div style={S.priceCard}&gt;&lt;p style={{ color: '#888', fontSize: '0.8rem' }}&gt;Weekly&lt;/p&gt;&lt;p style={S.price}&gt;R99&lt;/p&gt;&lt;/div&gt;
          &lt;div style={S.priceCard}&gt;&lt;p style={{ color: '#888', fontSize: '0.8rem' }}&gt;Monthly&lt;/p&gt;&lt;p style={S.price}&gt;R159&lt;/p&gt;&lt;/div&gt;
          &lt;div style={S.priceCard}&gt;&lt;p style={{ color: '#888', fontSize: '0.8rem' }}&gt;Yearly&lt;/p&gt;&lt;p style={S.price}&gt;R1,359&lt;/p&gt;&lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  )
}

function ListerDashboard() {
  return (
 &lt;div style={S.section}&gt;
 &lt;h1 style={S.h1}&gt;Lister Dashboard&lt;/h1&gt;
 &lt;div style={S.card}&gt;
 &lt;h2 style={S.h2}&gt;Lister Fee Information (Display Only)&lt;/h2&gt;
 &lt;div style={S.grid}&gt;
 &lt;div style={S.priceCard}&gt;&lt;p style={{ color: '#888', fontSize: '0.8rem' }}&gt;Content-only&lt;/p&gt;&lt;p style={S.price}&gt;Free&lt;/p&gt;&lt;p style={{ color: '#666', fontSize: '0.75rem' }}&gt;Content-only free&lt;/p&gt;&lt;/div&gt;
 &lt;div style={S.priceCard}&gt;&lt;p style={{ color: '#888', fontSize: '0.8rem' }}&gt;Service Lister&lt;/p&gt;&lt;p style={S.price}&gt;R200/mo&lt;/p&gt;&lt;p style={{ color: '#666', fontSize: '0.75rem' }}&gt;First month free&lt;/p&gt;&lt;/div&gt;
 &lt;div style={S.priceCard}&gt;&lt;p style={{ color: '#888', fontSize: '0.8rem' }}&gt;Services + Content&lt;/p&gt;&lt;p style={S.price}&gt;R200/mo&lt;/p&gt;&lt;/div&gt;
 &lt;/div&gt;
 &lt;/div&gt;
 &lt;/div&gt;
  )
}

function AdminDashboard() {
  return (
 &lt;div style={S.section}&gt;
 &lt;h1 style={S.h1}&gt;Admin Dashboard&lt;/h1&gt;
 &lt;div style={S.card}&gt;
 &lt;p style={S.p}&gt;Admin controls panel. User management and platform settings will appear here.&lt;/p&gt;
 &lt;p style={{ ...S.p, fontStyle: 'italic', marginTop: '0.5rem' }}&gt;No data available yet.&lt;/p&gt;
 &lt;/div&gt;
 &lt;/div&gt;
  )
}

function ComingSoonPage({ title }) {
  return (
 &lt;div style={S.section}&gt;
 &lt;h1 style={S.h1}&gt;{title}&lt;/h1&gt;
 &lt;div style={S.comingSoon}&gt;
 &lt;h2 style={S.h2}&gt;COMING SOON&lt;/h2&gt;
 &lt;p style={S.p}&gt;This section is under development. No payment actions are available.&lt;/p&gt;
 &lt;/div&gt;
 &lt;/div&gt;
  )
}

/* ───── Root App ───── */
export default function App() {
  return (
    &lt;BrowserRouter&gt;
      &lt;Routes&gt;
 &lt;Route path="/login" element={&lt;AuthPages /&gt;} /&gt;
 &lt;Route path="/*" element={&lt;AppShell /&gt;} /&gt;
 &lt;/Routes&gt;
 &lt;/BrowserRouter&gt;
  )
  }
