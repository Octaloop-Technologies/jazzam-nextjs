import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import TokenStorage from '@/lib/utils/tokenStorage';

interface UseLeadRealtimeReturn {
  socket: Socket | null;
  isConnected: boolean;
  newLead: Lead | null;
  updatedLead: Lead | null;
  deletedLeadId: string | null;
  crmSyncStats: any | null;
}

export const useLeadRealtime = (companyId: string | null | undefined): UseLeadRealtimeReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newLead, setNewLead] = useState<Lead | null>(null);
  const [updatedLead, setUpdatedLead] = useState<Lead | null>(null);
  const [deletedLeadId, setDeletedLeadId] = useState<string | null>(null);
  const [crmSyncStats, setCrmSyncStats] = useState<any | null>(null);

  useEffect(() => {
    if (!companyId) {
      console.log('⚠️ No companyId provided, skipping socket connection');
      return;
    }

    // Get auth token
    const { accessToken } = TokenStorage.getTokens();
    
    // Connect to Socket.IO server
    const socketInstance = io(process.env.NEXT_PUBLIC_BASE_URL?.replace('/api/v1', '') || 'http://localhost:4000', {
      transports: ['websocket', 'polling'],
      auth: {
        token: accessToken,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(socketInstance);

    // Connection events
    socketInstance.on('connect', () => {
      console.log('✅ Connected to Socket.IO server:', socketInstance.id);
      setIsConnected(true);
      
      // Join company-specific room
      socketInstance.emit('join:company', companyId);
      console.log(`📡 Joining company room: company_${companyId}`);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason);
      setIsConnected(false);
    });

    socketInstance.on('joined', (data) => {
      console.log('✅ Successfully joined room:', data.room);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      setIsConnected(false);
    });

    // Lead events
    socketInstance.on('lead:new', (event) => {
      console.log('📥 New lead received:', event.data);
      setNewLead(event.data);
      
      // Reset after a short delay to allow multiple updates
      setTimeout(() => setNewLead(null), 100);
    });

    socketInstance.on('lead:updated', (event) => {
      console.log('📝 Lead updated:', event.data);
      setUpdatedLead(event.data);
      
      setTimeout(() => setUpdatedLead(null), 100);
    });

    socketInstance.on('lead:deleted', (event) => {
      console.log('🗑️ Lead deleted:', event.data.leadId);
      setDeletedLeadId(event.data.leadId);
      
      setTimeout(() => setDeletedLeadId(null), 100);
    });

    socketInstance.on('crm:sync:completed', (event) => {
      console.log('🔄 CRM sync completed:', event.data);
      setCrmSyncStats(event.data);
      
      setTimeout(() => setCrmSyncStats(null), 100);
    });

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        console.log('👋 Leaving company room and disconnecting');
        socketInstance.emit('leave:company', companyId);
        socketInstance.disconnect();
      }
    };
  }, [companyId]);

  return {
    socket,
    isConnected,
    newLead,
    updatedLead,
    deletedLeadId,
    crmSyncStats,
  };
};