import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useWebSocket(registerId?: number) {
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const connectWebSocket = () => {
      try {
        wsRef.current = new WebSocket(wsUrl);
        
        wsRef.current.onopen = () => {
          console.log(`WebSocket connesso - CASSA ${registerId || '?'} sincronizzazione attiva`);
          // Send registration message
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && registerId) {
            wsRef.current.send(JSON.stringify({ 
              type: 'REGISTER_CLIENT', 
              registerId: registerId 
            }));
          }
        };
        
        wsRef.current.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            
            switch (message.type) {
              case 'ORDER_CREATED':
              case 'ORDER_COMPLETED':
              case 'INITIAL_SYNC':
                queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
                queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
                console.log(`Sincronizzazione ricevuta: ${message.type}`);
                break;
              case 'SETTINGS_UPDATED':
                // Update settings in React Query cache and notify listeners
                queryClient.setQueryData(['/api/settings'], message.data);
                window.dispatchEvent(new CustomEvent('settings-updated', { detail: message.data }));
                console.log('Impostazioni aggiornate via WebSocket');
                break;
              case 'DATA_CLEARED':
                queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
                queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
                break;
            }
          } catch (error) {
            console.error('Errore parsing WebSocket message:', error);
          }
        };
        
        wsRef.current.onclose = () => {
          console.log(`CASSA ${registerId || '?'} - WebSocket disconnesso, riconnessione in 3 secondi`);
          setTimeout(connectWebSocket, 3000);
        };
        
        wsRef.current.onerror = (error) => {
          console.error('WebSocket errore:', error);
        };
        
      } catch (error) {
        console.error('Errore connessione WebSocket:', error);
        setTimeout(connectWebSocket, 3000);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [queryClient, registerId]);

  return wsRef.current;
}