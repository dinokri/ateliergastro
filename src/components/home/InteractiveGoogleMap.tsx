import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

interface InteractiveGoogleMapProps {
  apiKey: string;
  position: { lat: number; lng: number };
  name: string;
  onError: () => void;
}

export const InteractiveGoogleMap: React.FC<InteractiveGoogleMapProps> = ({
  apiKey,
  position,
  name,
  onError,
}) => {
  return (
    <APIProvider apiKey={apiKey} language="bs" region="BA" onError={onError}>
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
        <AdvancedMarker position={position} title={name}>
          <Pin
            background="#B66F52"
            borderColor="#20221F"
            glyphColor="#FFFFFF"
            scale={1.2}
          />
        </AdvancedMarker>
      </Map>
    </APIProvider>
  );
};

export default InteractiveGoogleMap;
