import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, ExternalLink, Clock, Phone, Car } from 'lucide-react';
import firebaseConfig from '../../../firebase-applet-config.json';

export const MapLocationSection: React.FC = () => {
  const { language, settings } = useRestaurant();
  const [mapError, setMapError] = useState(false);

  // Gracefully catch Google Maps authorization errors without throwing unhandled exceptions
  React.useEffect(() => {
    const prevAuthFailure = (window as unknown as { gm_authFailure?: () => void }).gm_authFailure;
    (window as unknown as { gm_authFailure?: () => void }).gm_authFailure = () => {
      setMapError(true);
      if (typeof prevAuthFailure === 'function') {
        prevAuthFailure();
      }
    };
    return () => {
      (window as unknown as { gm_authFailure?: () => void }).gm_authFailure = prevAuthFailure;
    };
  }, []);

  // Use configured key or demo fallback
  const mapsApiKey = 
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_MAPS_API_KEY) || 
    firebaseConfig.apiKey || 
    '';

  const position = { lat: settings.lat, lng: settings.lng };
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${settings.lat},${settings.lng}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${settings.lat},${settings.lng}`;

  return (
    <section className="py-20 bg-[#F7F4ED] text-[#20221F] border-t border-[#E9E1D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-semibold text-[#3F4734] mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#96472C]" />
            <span>{language === 'bs' ? 'Lokacija & Pristup' : 'Location & Directions'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#20221F]">
            {language === 'bs' ? 'Posjetite Nas u Srcu Sarajeva' : 'Visit Atelier Bistro'}
          </h2>
          <p className="text-xs sm:text-sm text-[#20221F]/70 mt-3 font-light">
            {language === 'bs'
              ? 'Nalazimo se na Obali Kulina bana, nekoliko koraka od Latinske ćuprije i historijskog centra grada.'
              : 'Situated along Obala Kulina bana, just steps away from the historic Latin Bridge in Sarajevo.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Information Card (4 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-[#E9E1D4] shadow-md flex flex-col justify-between">
            <div className="space-y-6">
              
              <div>
                <h3 className="font-serif text-2xl font-semibold text-[#20221F]">
                  {settings.name}
                </h3>
                <p className="text-xs text-[#59634A] uppercase tracking-wider font-medium mt-0.5">
                  Sarajevo, Bosna i Hercegovina
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#20221F]/80">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#96472C] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[#20221F]">{settings.address}</span>
                    <span>{settings.postalCode} {settings.city}, {settings.country}</span>
                    <span className="text-[11px] text-[#20221F]/70 block mt-0.5">
                      GPS: {settings.lat.toFixed(4)}°N, {settings.lng.toFixed(4)}°E
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#3F4734] shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-[#96472C] font-semibold transition-colors">
                    {settings.phone}
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#59634A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[#20221F]">
                      {language === 'bs' ? 'Svaki dan: 08:00 - 23:00 / 00:00' : 'Daily: 08:00 - 23:00 / 00:00'}
                    </span>
                    <span className="text-[11px] text-[#20221F]/60">
                      {language === 'bs' ? 'Rezervacije preporučujemo u večernjim terminima' : 'Evening bookings recommended'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <Car className="w-4 h-4 text-[#59634A] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#20221F]/70">
                    {language === 'bs' 
                      ? 'Dostupan parking u obližnjoj garaži Sarajevo City Centar / Vijećnica (3 min hoda).'
                      : 'Public parking garage available within 3 minutes walking distance.'}
                  </span>
                </div>
              </div>

            </div>

            {/* Direction Navigation Buttons */}
            <div className="pt-8 border-t border-[#E9E1D4] flex flex-col sm:flex-row gap-3">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-[#59634A] hover:bg-[#3F4734] text-white text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Navigation className="w-4 h-4" />
                <span>{language === 'bs' ? 'Upute za Vožnju' : 'Get Directions'}</span>
              </a>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 rounded-xl border border-[#E9E1D4] hover:bg-[#F7F4ED] text-[#20221F] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-[#59634A]" />
                <span>Google Maps</span>
              </a>
            </div>

          </div>

          {/* Interactive Map (7 cols) */}
          <div className="lg:col-span-7 h-[420px] rounded-2xl overflow-hidden border border-[#E9E1D4] shadow-md relative bg-[#E9E1D4]/40">
            {mapsApiKey && !mapError ? (
              <APIProvider apiKey={mapsApiKey} language="bs" region="BA">
                <Map
                  mapId="DEMO_MAP_ID"
                  defaultCenter={position}
                  defaultZoom={15}
                  gestureHandling="cooperative"
                  disableDefaultUI={false}
                  className="w-full h-full min-h-[420px]"
                  style={{ width: '100%', height: '100%' }}
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                >
                  <AdvancedMarker position={position} title={settings.name}>
                    <Pin
                      background="#B66F52"
                      borderColor="#20221F"
                      glyphColor="#FFFFFF"
                      scale={1.2}
                    />
                  </AdvancedMarker>
                </Map>
              </APIProvider>
            ) : (
              /* Fallback Interactive Embed Map */
              <div className="w-full h-full relative">
                <iframe
                  title="Atelier Bistro Sarajevo Map Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${settings.lat},${settings.lng}&z=15&output=embed`}
                />
              </div>
            )}

            {/* In-Map Info Overlay Badge */}
            <div className="absolute top-3 left-3 bg-[#20221F]/90 backdrop-blur-md text-[#F7F4ED] p-2.5 rounded-xl shadow-lg border border-[#3F4734] pointer-events-none hidden sm:block max-w-xs">
              <div className="font-serif text-sm font-semibold">{settings.name}</div>
              <div className="text-[10px] text-[#E9E1D4]/80">{settings.address}, Sarajevo</div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
