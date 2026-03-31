import { useEffect, useRef, useState } from 'react';

interface PeerConnection {
  peerId: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const useWebRTC = (
  roomId: string | undefined,
  localStream: MediaStream | null,
  socket: any,
  isConnected: boolean
) => {
  const [peers, setPeers] = useState<Map<string, PeerConnection>>(new Map());
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());

  // Create peer connection
  const createPeerConnection = (peerId: string): RTCPeerConnection => {
    console.log('🔗 Creating peer connection for:', peerId);

    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Add local stream tracks to peer connection
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
        console.log('➕ Added track to peer connection:', track.kind);
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('🧊 Sending ICE candidate to:', peerId);
        socket.emit('ice-candidate', {
          to: peerId,
          candidate: event.candidate,
        });
      }
    };

    // Handle incoming stream
    pc.ontrack = (event) => {
      console.log('📺 Received remote track from:', peerId);
      setPeers((prev) => {
        const newPeers = new Map(prev);
        const peerConn = newPeers.get(peerId);
        if (peerConn) {
          peerConn.stream = event.streams[0];
        }
        return newPeers;
      });
    };

    // Connection state changes
    pc.onconnectionstatechange = () => {
      console.log(`🔌 Connection state for ${peerId}:`, pc.connectionState);
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        removePeer(peerId);
      }
    };

    peersRef.current.set(peerId, pc);
    return pc;
  };

  // Create and send offer
  const createOffer = async (peerId: string) => {
    try {
      const pc = createPeerConnection(peerId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log('📤 Sending offer to:', peerId);
      socket.emit('offer', { to: peerId, offer });

      setPeers((prev) => new Map(prev).set(peerId, { peerId, connection: pc }));
    } catch (error) {
      console.error('❌ Error creating offer:', error);
    }
  };

  // Handle received offer
  const handleOffer = async (from: string, offer: RTCSessionDescriptionInit) => {
    try {
      console.log('📥 Received offer from:', from);
      const pc = createPeerConnection(from);

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      console.log('📤 Sending answer to:', from);
      socket.emit('answer', { to: from, answer });

      setPeers((prev) => new Map(prev).set(from, { peerId: from, connection: pc }));
    } catch (error) {
      console.error('❌ Error handling offer:', error);
    }
  };

  // Handle received answer
  const handleAnswer = async (from: string, answer: RTCSessionDescriptionInit) => {
    try {
      console.log('📥 Received answer from:', from);
      const pc = peersRef.current.get(from);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    } catch (error) {
      console.error('❌ Error handling answer:', error);
    }
  };

  // Handle ICE candidate
  const handleIceCandidate = async (from: string, candidate: RTCIceCandidateInit) => {
    try {
      const pc = peersRef.current.get(from);
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
        console.log('🧊 Added ICE candidate from:', from);
      }
    } catch (error) {
      console.error('❌ Error handling ICE candidate:', error);
    }
  };

  // Remove peer
  const removePeer = (peerId: string) => {
    console.log('🗑️ Removing peer:', peerId);
    const pc = peersRef.current.get(peerId);
    if (pc) {
      pc.close();
      peersRef.current.delete(peerId);
    }
    setPeers((prev) => {
      const newPeers = new Map(prev);
      newPeers.delete(peerId);
      return newPeers;
    });
  };

  // Setup socket listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleUserConnected = (userId: string) => {
      console.log('👤 User connected, creating offer for:', userId);
      createOffer(userId);
    };

    const handleUserDisconnected = (userId: string) => {
      console.log('👋 User disconnected:', userId);
      removePeer(userId);
    };

    const handleExistingUsers = (users: string[]) => {
      console.log('👥 Existing users:', users);
      users.forEach((userId) => createOffer(userId));
    };

    const unsubUserConnected = socket.on('user-connected', handleUserConnected);
    const unsubUserDisconnected = socket.on('user-disconnected', handleUserDisconnected);
    const unsubExistingUsers = socket.on('existing-users', handleExistingUsers);
    const unsubOffer = socket.on('offer', ({ from, offer }: any) => handleOffer(from, offer));
    const unsubAnswer = socket.on('answer', ({ from, answer }: any) => handleAnswer(from, answer));
    const unsubIceCandidate = socket.on('ice-candidate', ({ from, candidate }: any) =>
      handleIceCandidate(from, candidate)
    );

    return () => {
      unsubUserConnected();
      unsubUserDisconnected();
      unsubExistingUsers();
      unsubOffer();
      unsubAnswer();
      unsubIceCandidate();
    };
  }, [socket, isConnected, localStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      peersRef.current.forEach((pc) => pc.close());
      peersRef.current.clear();
    };
  }, []);

  return { peers };
};