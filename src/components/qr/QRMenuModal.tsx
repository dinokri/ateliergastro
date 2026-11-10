import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useRestaurant } from '../../context/RestaurantContext';
import { X, QrCode, Download, Printer, ExternalLink, Check, Copy } from 'lucide-react';

interface QRMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRMenuModal: React.FC<QRMenuModalProps> = ({ isOpen, onClose }) => {
  const { language, settings } = useRestaurant();
  const [selectedTable, setSelectedTable] = useState('1');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://atelierbistro.ba';
  const tableOrderUrl = `${baseUrl}/?table=${encodeURIComponent(selectedTable)}`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(tableOrderUrl, {
        width: 380,
        margin: 2,
        color: {
          dark: '#20221F',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR generation failed', err));
    }
  }, [isOpen, tableOrderUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(tableOrderUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white text-[#20221F] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-[#E9E1D4] flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
      >
        
        {/* Header */}
        <div className="p-6 bg-[#F7F4ED] border-b border-[#E9E1D4] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#59634A] text-white rounded-xl shadow-sm">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 id="qr-modal-title" className="font-serif text-xl font-semibold text-[#20221F]">
                {language === 'bs' ? 'QR Meni za Stolove' : 'Table QR Code Generator'}
              </h2>
              <span className="text-xs text-[#59634A] font-medium">
                {language === 'bs' ? 'Digitalni meni sa direktnim naručivanjem' : 'Direct contactless table ordering'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-[#20221F] hover:bg-[#E9E1D4] transition-colors"
            aria-label="Zatvori prozor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-center">
          
          {/* Table Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#59634A] mb-2 text-left">
              {language === 'bs' ? 'Odaberite Broj ili Oznaku Stola:' : 'Select Table Identifier:'}
            </label>
            <div className="flex items-center gap-2">
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-[#E9E1D4] bg-[#F7F4ED]/50 focus:outline-none focus:border-[#B66F52]"
              >
                {[...Array(20)].map((_, i) => (
                  <option key={i + 1} value={String(i + 1)}>
                    {language === 'bs' ? `Sto #${i + 1} (Glavni Salon)` : `Table #${i + 1} (Dining Salon)`}
                  </option>
                ))}
                <option value="Terasa 1">Terasa #1</option>
                <option value="Terasa 2">Terasa #2</option>
                <option value="Terasa 3">Terasa #3</option>
                <option value="Vinski Podrum 1">Vinski Podrum #1</option>
                <option value="Chef Table">Chef’s Table</option>
              </select>
            </div>
          </div>

          {/* Printable Stand Card Preview */}
          <div 
            ref={printRef}
            className="printable-area p-8 rounded-2xl border-2 border-dashed border-[#59634A]/40 bg-[#F7F4ED] max-w-sm mx-auto shadow-inner flex flex-col items-center"
          >
            <span className="font-serif text-2xl font-bold tracking-widest uppercase text-[#20221F]">
              {settings.name}
            </span>
            <span className="text-[10px] tracking-[0.25em] text-[#B66F52] uppercase font-semibold mt-0.5">
              Sarajevo &bull; Digitalni Meni
            </span>

            {/* QR Code Graphic */}
            <div className="my-5 p-3 bg-white rounded-2xl shadow-md border border-[#E9E1D4]">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt={`QR Code for Table ${selectedTable}`} className="w-52 h-52 object-contain" />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center text-xs text-stone-400">
                  Učitavanje...
                </div>
              )}
            </div>

            <div className="text-center space-y-1">
              <span className="inline-block px-3 py-1 bg-[#20221F] text-[#F7F4ED] text-xs font-bold rounded-lg uppercase tracking-wider">
                {language === 'bs' ? `Sto: ${selectedTable}` : `Table: ${selectedTable}`}
              </span>
              <p className="text-[11px] text-[#20221F]/70 pt-1">
                {language === 'bs' 
                  ? 'Skenirajte kamerom mobitela za pregled hrane i naručivanje za stolom.'
                  : 'Scan with smartphone camera to browse menu & order to your table.'}
              </p>
            </div>
          </div>

          {/* Direct Link Row */}
          <div className="p-3 bg-stone-50 rounded-xl border border-[#E9E1D4] flex items-center justify-between text-xs">
            <span className="truncate text-stone-600 font-mono text-[11px] max-w-[260px]">
              {tableOrderUrl}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-700 transition-colors"
                title={language === 'bs' ? 'Kopiraj link' : 'Copy link'}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <a
                href={tableOrderUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-700 transition-colors"
                title={language === 'bs' ? 'Testiraj u novom tabu' : 'Test in new tab'}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#F7F4ED] border-t border-[#E9E1D4] flex flex-col sm:flex-row gap-3 shrink-0">
          <a
            href={qrDataUrl}
            download={`Atelier-Bistro-QR-Table-${selectedTable}.png`}
            className="flex-1 py-3 px-4 rounded-xl bg-[#59634A] hover:bg-[#3F4734] text-white text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'bs' ? 'Preuzmi PNG Sliku' : 'Download QR PNG'}</span>
          </a>

          <button
            onClick={handlePrint}
            className="py-3 px-5 rounded-xl border border-[#E9E1D4] bg-white hover:bg-[#F7F4ED] text-[#20221F] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4 text-[#B66F52]" />
            <span>{language === 'bs' ? 'Printaj Karticu za Sto' : 'Print Table Stand'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
