import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function AuthScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault(); setFeedback(''); setLoading(true);
    try {
      if (mode === 'login') await login({ email: form.email, password: form.password });
      else { await register(form); await login({ email: form.email, password: form.password }); }
    } catch (error) { setFeedback(error.message); } finally { setLoading(false); }
  }

  return <main className="auth-shell">
    <section className="auth-intro"><span className="brand-mark">AD</span><p className="eyebrow">AULA EM DIA</p><h1>Estude com clareza.<br /><em>Avance no seu ritmo.</em></h1><p className="intro-copy">Um espaço calmo para transformar matérias, prazos e pequenas vitórias em um plano possível.</p><div className="intro-line" /></section>
    <section className="auth-panel"><div className="panel-top"><span>{mode === 'login' ? 'Bem-vindo de volta' : 'Comece seu planejamento'}</span><span className="panel-count">01 / 02</span></div><h2>{mode === 'login' ? 'Entrar na sua rotina' : 'Criar seu espaço'}</h2><p className="muted">{mode === 'login' ? 'Acompanhe o que merece sua atenção hoje.' : 'Organize seus estudos em poucos passos.'}</p>
      <form onSubmit={submit}>{mode === 'register' && <label>Seu nome<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Como podemos te chamar?" /></label>}<label>E-mail<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="voce@exemplo.com" /></label><label>Senha<input required minLength="6" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mínimo de 6 caracteres" /></label>{feedback && <p className="form-error">{feedback}</p>}<button className="primary-button" disabled={loading}>{loading ? 'Aguarde...' : mode === 'login' ? 'Entrar na conta' : 'Criar conta'}</button></form>
      <button className="switch-button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setFeedback(''); }}>{mode === 'login' ? 'Ainda não tenho uma conta' : 'Já tenho uma conta'}</button>
    </section>
  </main>;
}
