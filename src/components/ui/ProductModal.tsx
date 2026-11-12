import React, { useState } from 'react';
import { CulturalExhibit } from '../../utils/culturalData';
import { soundManager } from '../../utils/sound';
import {
  X,
  ShoppingBag,
  MapPin,
  CheckCircle,
  Copy,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Heart
} from 'lucide-react';

interface ProductModalProps {
  exhibit: CulturalExhibit | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ exhibit, onClose }) => {
  const [isReserved, setIsReserved] = useState(false);
  const [copiedContact, setCopiedContact] = useState(false);

  if (!exhibit) return null;

  const product = exhibit.productAction;

  const handleSimulateInquiry = () => {
    soundManager.playInteractChime();
    setIsReserved(true);
  };

  const handleCopyContact = () => {
    soundManager.playUiClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Kemitraan UMKM Budaya CultureVerse: ${product.artisanGroup} (${product.location}) - Produk: ${product.productTitle}`
      );
      setCopiedContact(true);
      setTimeout(() => setCopiedContact(false), 2500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(5, 7, 10, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '16px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          background: 'linear-gradient(145deg, #12151e 0%, #1a1e2b 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(212, 175, 55, 0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Top Gold Bar */}
        <div
          style={{
            height: '4px',
            width: '100%',
            background: 'linear-gradient(90deg, #aa8c2c, #ffd700, #aa8c2c)'
          }}
        />

        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffd700'
              }}
            >
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                Katalog Karya Mitra Pengrajin
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0' }}>
                Dukungan Langsung untuk Keberlanjutan Komunitas Perajin (SDG 11)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playUiClick();
              onClose();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#cbd5e1',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#d4af37',
                  background: 'rgba(212, 175, 55, 0.12)',
                  padding: '2px 8px',
                  borderRadius: '6px'
                }}
              >
                Karya Tradisional Asli
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: '#4ade80',
                  background: 'rgba(74, 222, 128, 0.12)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <CheckCircle size={11} />
                Fair Trade & Cagar Budaya
              </span>
            </div>

            <h4
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '18px',
                fontWeight: 700,
                color: '#ffffff',
                margin: '4px 0 6px'
              }}
            >
              {product.productTitle}
            </h4>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#cbd5e1' }}>
              <MapPin size={14} color="#d4af37" />
              <span>
                Diproduksi oleh: <strong>{product.artisanGroup}</strong> — {product.location}
              </span>
            </div>
          </div>

          {/* Pricing & Estimation Box */}
          <div
            style={{
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '12px', color: '#f5d77f', fontWeight: 600 }}>
                Apresiasi Nilai Karya Seni
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#ffd700', fontFamily: "'Cinzel', serif" }}>
                {product.priceEstimation}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '11px', color: '#94a3b8' }}>
              <div>100% Mengalir ke Sanggar</div>
              <div style={{ color: '#4ade80', fontWeight: 600 }}>Bebas Biaya Perantara</div>
            </div>
          </div>

          <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#cbd5e1', margin: 0 }}>
            {product.description}
          </p>

          <div
            style={{
              fontSize: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '10px 14px',
              borderRadius: '8px',
              color: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={16} color="#ffd700" style={{ flexShrink: 0 }} />
            <span>
              <strong>Jaminan Autentisitas:</strong> {product.authenticGuarantee}
            </span>
          </div>

          {isReserved && (
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid #22c55e',
                borderRadius: '10px',
                padding: '14px',
                color: '#bbf7d0',
                fontSize: '13px',
                lineHeight: 1.5,
                animation: 'fadeIn 0.25s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, marginBottom: '4px' }}>
                <CheckCircle size={16} color="#4ade80" />
                Permintaan Kurasi Berhasil Dicatat!
              </div>
              Simulasi inquiry Anda telah terdaftar dalam sistem reservasi katalog CultureVerse. Pengurus sanggar {product.artisanGroup} akan menerima notifikasi apresiasi karya ini.
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div
          style={{
            padding: '18px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(10, 12, 17, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <button
            onClick={handleCopyContact}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#e2e8f0',
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Copy size={15} />
            <span>{copiedContact ? 'Info Kontak Tersalin' : 'Salin Info Sanggar'}</span>
          </button>

          <button
            onClick={handleSimulateInquiry}
            disabled={isReserved}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: isReserved
                ? 'rgba(34, 197, 94, 0.3)'
                : 'linear-gradient(135deg, #d4af37 0%, #aa8c2c 100%)',
              color: isReserved ? '#4ade80' : '#0d1017',
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 800,
              cursor: isReserved ? 'default' : 'pointer',
              boxShadow: isReserved ? 'none' : '0 4px 16px rgba(212, 175, 55, 0.3)'
            }}
          >
            {isReserved ? (
              <>
                <CheckCircle size={16} />
                <span>Inquiry Terkirim</span>
              </>
            ) : (
              <>
                <MessageSquare size={16} />
                <span>Simulasi Hubungi Pengrajin</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

