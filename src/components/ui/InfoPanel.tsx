import React, { useEffect, useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, X, MapPin } from 'lucide-react';
import { ISLANDS, PROVINCES_BY_ISLAND, getProvince } from '../../data/islands';
import { museum, useMuseum } from '../../state/museumStore';
import { soundManager } from '../../utils/sound';
import { ProvinceVisual } from './ProvinceVisual';
import type { Province } from '../../data/types';

type Tab = 'foods' | 'products' | 'arts' | 'history';
const TABS: { id: Tab; label: string }[] = [
  { id: 'foods', label: 'Makanan' },
  { id: 'products', label: 'Produk' },
  { id: 'arts', label: 'Budaya' },
  { id: 'history', label: 'Sejarah' }
];

const ProvinceDetail: React.FC<{ province: Province }> = ({ province }) => {
  const [tab, setTab] = useState<Tab>('foods');
  useEffect(() => setTab('foods'), [province.id]);
  const list = tab === 'history' ? null : province[tab];
  return (
    <>
      <div className="detail__hero">
        <ProvinceVisual province={province} />
      </div>
      <div className="detail__name">{province.name}</div>
      <div className="detail__cap">
        <MapPin size={12} style={{ verticalAlign: '-1px' }} /> Ibu kota: {province.capital}
      </div>
      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`tab ${tab === t.id ? 'on' : ''}`}
            onClick={() => {
              soundManager.playUiClick();
              setTab(t.id);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="items" key={tab}>
        {list ? (
          list.map((it) => (
            <div className="item" key={it.name}>
              <b>{it.name}</b>
              <span>{it.note}</span>
            </div>
          ))
        ) : (
          <div className="history">{province.history}</div>
        )}
      </div>
    </>
  );
};

export const InfoPanel: React.FC = () => {
  const zoneId = useMuseum((s) => s.activeZone);
  const selectedId = useMuseum((s) => s.selectedProvince);
  const [speaking, setSpeaking] = useState(false);

  const island = zoneId ? ISLANDS[zoneId] : null;
  const provinces = zoneId ? PROVINCES_BY_ISLAND[zoneId] : [];
  const selected = getProvince(selectedId);

  // hentikan narasi saat konteks berganti
  useEffect(() => {
    soundManager.stopNarration();
    setSpeaking(false);
  }, [zoneId, selectedId]);

  if (!island) return null;

  const close = () => {
    soundManager.stopNarration();
    soundManager.playUiClick();
    museum.closeZone();
  };

  const narrate = () => {
    if (speaking) {
      soundManager.stopNarration();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    const text = selected
      ? `${selected.name}, ibu kota ${selected.capital}. Makanan khas: ${selected.foods.map((f) => f.name).join(', ')}. Produk unggulan: ${selected.products.map((f) => f.name).join(', ')}. Kesenian dan budaya: ${selected.arts.map((f) => f.name).join(', ')}. ${selected.history}`
      : `Pulau ${island.name}. ${island.tagline}. ${island.description} Terdapat ${provinces.length} provinsi: ${provinces.map((p) => p.name).join(', ')}.`;
    soundManager.speakNarration(text, () => setSpeaking(false));
  };

  return (
    <aside className="panel" aria-label={`Panel pameran ${island.name}`}>
      <div className="panel__head">
        {selected && (
          <button
            className="icon-btn"
            aria-label="Kembali ke daftar provinsi"
            onClick={() => {
              soundManager.playUiClick();
              museum.selectProvince(null);
            }}
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="panel__eyebrow">Zona Pameran · {provinces.length} Provinsi</div>
          <div className="panel__title">{island.name}</div>
          <div className="panel__tag">{island.tagline}</div>
        </div>
        <button className="icon-btn" aria-label="Tutup panel" onClick={close}>
          <X size={18} />
        </button>
      </div>

      <div className="panel__scroll">
        {selected ? (
          <ProvinceDetail province={selected} />
        ) : (
          <>
            <p className="panel__desc">{island.description}</p>
            <div className="facts">
              {island.facts.map((f) => (
                <div className="fact" key={f.label}>
                  <span>{f.label}</span>
                  <span>{f.value}</span>
                </div>
              ))}
            </div>
            <div className="section-t">Daftar Provinsi</div>
            <div className="pgrid">
              {provinces.map((p) => (
                <button
                  key={p.id}
                  className="pcard"
                  onMouseEnter={() => museum.hoverProvince(p.id)}
                  onMouseLeave={() => museum.hoverProvince(null)}
                  onClick={() => {
                    soundManager.playInteractChime();
                    museum.selectProvince(p.id);
                  }}
                >
                  <div className="pcard__vis">
                    <ProvinceVisual province={p} />
                  </div>
                  <div className="pcard__body">
                    <div className="pcard__name">{p.name}</div>
                    <div className="pcard__cap">{p.foods[0]?.name} · {p.products[0]?.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="panel__foot">
        <button className={`chip-btn ${speaking ? 'on' : ''}`} onClick={narrate}>
          {speaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
          {speaking ? 'Hentikan Narasi' : 'Dengarkan Narasi'}
        </button>
        <button className="chip-btn" onClick={close} style={{ marginLeft: 'auto' }}>
          Tutup (Esc)
        </button>
      </div>
    </aside>
  );
};
