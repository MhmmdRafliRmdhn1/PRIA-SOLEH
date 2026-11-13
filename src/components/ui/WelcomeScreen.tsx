import React, { useId, useState } from 'react';
import { ArrowRight, Compass, Globe2, Landmark, Leaf, UserRound } from 'lucide-react';

const NAME_KEY = 'cultureverse.visitor-name';

function readSavedName() {
  try { return localStorage.getItem(NAME_KEY)?.slice(0, 30) ?? ''; }
  catch { return ''; }
}

export function WelcomeScreen({ onEnter }: { onEnter: (name: string) => void }) {
  const [name, setName] = useState(readSavedName);
  const [remember, setRemember] = useState(() => name.length > 0);
  const [error, setError] = useState('');
  const inputId = useId();
  const errorId = useId();

  function enterMuseum(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError('Isi nama pengunjung minimal 2 karakter.');
      document.getElementById(inputId)?.focus();
      return;
    }
    try {
      if (remember) localStorage.setItem(NAME_KEY, trimmed);
      else localStorage.removeItem(NAME_KEY);
    } catch { /* Entry remains available when browser storage is disabled. */ }
    onEnter(trimmed);
  }

  return (
    <main className="welcome-page">
      <header className="welcome-header">
        <a href="#" className="welcome-brand" aria-label="Cultureverse beranda">
          <span className="brand-symbol"><Landmark size={24} /></span>
          <span>CULTUREVERSE<small>MUSEUM VIRTUAL NUSANTARA</small></span>
        </a>
        <span className="heritage-badge"><Leaf size={14} aria-hidden="true" /> Mendukung SDG 11.4</span>
      </header>

      <div className="welcome-layout">
        <section className="welcome-story" aria-labelledby="welcome-heading">
          <div className="welcome-eyebrow"><span /> SATU NUSANTARA, JUTAAN CERITA</div>
          <h1 id="welcome-heading">Warisan kita.<br />Petualangan <em>kamu.</em></h1>
          <p className="welcome-description">Langkahkan avatarmu ke dunia budaya Indonesia. Temukan cerita di balik setiap karya, kenali para perajinnya, dan ikut jaga warisannya.</p>

          <div className="gallery-art" role="img" aria-label="Ilustrasi galeri museum dengan pilar, kain tradisional, dan karpet merah">
            <div className="gallery-arch" />
            <div className="gallery-floor" />
            <div className="gallery-carpet" />
            <div className="gallery-pillar pillar-one" /><div className="gallery-pillar pillar-two" />
            <div className="gallery-pillar pillar-three" /><div className="gallery-pillar pillar-four" />
            <div className="art-display display-left"><div className="textile textile-red" /><span>01 / TENUN NUSANTARA</span></div>
            <div className="art-display display-right"><div className="textile textile-blue" /><span>02 / JEJAK BATIK</span></div>
            <div className="gallery-caption"><span className="live-dot" /> MUSEUM VIRTUAL 3D <span>Jelajahi. Kenali. Lestarikan.</span></div>
          </div>
        </section>

        <section className="entry-card" aria-labelledby="entry-heading">
          <div className="entry-icon"><Compass size={27} strokeWidth={1.4} aria-hidden="true" /></div>
          <p className="entry-eyebrow">PERJALANAN DIMULAI DI SINI</p>
          <h2 id="entry-heading">Selamat datang,<br />penjelajah budaya.</h2>
          <p className="entry-description">Kenalan dulu, yuk. Siapa nama yang ingin kamu gunakan di museum?</p>

          <form onSubmit={enterMuseum} noValidate>
            <label className="name-label" htmlFor={inputId}>Nama pengunjung</label>
            <div className={`visitor-input${error ? ' has-error' : ''}`}>
              <UserRound size={18} aria-hidden="true" />
              <input id={inputId} name="visitorName" type="text" autoComplete="nickname" placeholder="Tulis nama kamu" value={name} maxLength={30} required minLength={2}
                aria-invalid={!!error} aria-describedby={error ? errorId : undefined}
                onChange={event => { setName(event.target.value); setError(''); }} />
            </div>
            {error && <p id={errorId} className="entry-error" role="alert">{error}</p>}
            <label className="remember-name"><input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)} /> Ingat nama saya di perangkat ini</label>
            <button className="enter-museum" type="submit">Masuk museum <ArrowRight size={19} aria-hidden="true" /></button>
          </form>

          <p className="entry-note">Cukup nama, tanpa membuat akun.<br />Gratis untuk siapa pun yang ingin mengenal budaya.</p>
          <div className="entry-divider" />
          <div className="entry-features"><span><Globe2 size={17} aria-hidden="true" /> Eksplorasi 3D</span><span><Landmark size={17} aria-hidden="true" /> Warisan Nusantara</span></div>
        </section>
      </div>

      <footer className="welcome-footer"><span>Budaya hidup saat kita mengenalnya.</span><span>Dari Nusantara, untuk generasi berikutnya.</span></footer>
    </main>
  );
}
