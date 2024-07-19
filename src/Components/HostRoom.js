import React, { useEffect, useCallback, useState } from "react";
import peer from "./peer";
import { useSocket } from "./SocketProvider";
import { connect } from "react-redux";
import webrtcDataActions from "../store/actions/webrtcAction";
import { useNavigate } from "react-router-dom";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const mapStateToProps = (state) => {
    return {
      // profileId: state?.webrtcReducer?.profileId,
      languageCode: state?.webrtcReducer?.code,
    }
  };
  const mapDispatchToProps = {
    putVioceForTranslation: webrtcDataActions.putVioceForTranslation,
    setHostRemoteStream: webrtcDataActions.setRemoteStream,
    setHostMyStream: webrtcDataActions.setMyStream,
    setReduxRemoteSocketId: webrtcDataActions.setRemoteSocketId
  
  }
  
  const HostBase = (props) => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();
    // const { putVioceForTranslation, languageCode } = props;
    const { setHostRemoteStream, setHostMyStream, setReduxRemoteSocketId } = props;
    const [isMuted, setIsMuted] = useState(false);
  
    const navigate = useNavigate();
  
    const handleUserJoined = useCallback(({ email, id }) => {
      setRemoteSocketId(id);
      setReduxRemoteSocketId(id);
    }, []);
  
    const handleCallUser = useCallback(async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      const offer = await peer.getOffer();
      socket.emit("user:call", { to: remoteSocketId, offer });
      setMyStream(stream);
    }, [remoteSocketId, socket]);
  
    useEffect(() => {
      if (remoteSocketId) {
        handleCallUser();
      }
    }, [socket, remoteSocketId, handleCallUser]);
  
    const handleIncommingCall = useCallback(
      async ({ from, offer }) => {
        setRemoteSocketId(from);
        setReduxRemoteSocketId(from);
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setMyStream(stream);
        const ans = await peer.getAnswer(offer);
        socket.emit("call:accepted", { to: from, ans });
      },
      [socket]
    );
  
    // useEffect(() => {
    //   if (myStream&&languageCode) {
    //     putVioceForTranslation(myStream,languageCode);
    //   }
    // }, [myStream, putVioceForTranslation,languageCode])
  
    useEffect(() => {
      if (myStream) {
        setHostMyStream(myStream);
      }
      if (remoteStream) {
        setHostRemoteStream(remoteStream);
      }
    }, [myStream, remoteStream, setHostMyStream, setHostRemoteStream])
  
    const sendStreams = useCallback(() => {
      if (myStream) {
        for (const track of myStream.getTracks()) {
          peer.peer.addTrack(track, myStream);
        }
      }
    }, [myStream]);
  
    const handleCallAccepted = useCallback(
      ({ from, ans }) => {
        peer.setLocalDescription(ans);
        sendStreams();
      },
      [sendStreams]
    );
  
    const handleNegoNeeded = useCallback(async () => {
      const offer = await peer.getOffer();
      socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
    }, [remoteSocketId, socket]);
  
    useEffect(() => {
      peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
      return () => {
        peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
      };
    }, [handleNegoNeeded]);
  
    const handleNegoNeedIncomming = useCallback(
      async ({ from, offer }) => {
        const ans = await peer.getAnswer(offer);
        socket.emit("peer:nego:done", { to: from, ans });
      },
      [socket]
    );
  
    const handleNegoNeedFinal = useCallback(async ({ ans }) => {
      await peer.setLocalDescription(ans);
    }, []);
  
    useEffect(() => {
      peer.peer.addEventListener("track", async (ev) => {
        const remoteStream = ev.streams;
        setRemoteStream(remoteStream[0]);
      });
    }, []);
  
    useEffect(() => {
      socket.on("user:joined", handleUserJoined);
      socket.on("incomming:call", handleIncommingCall);
      socket.on("call:accepted", handleCallAccepted);
      socket.on("peer:nego:needed", handleNegoNeedIncomming);
      socket.on("peer:nego:final", handleNegoNeedFinal);
  
      return () => {
        socket.off("user:joined", handleUserJoined);
        socket.off("incomming:call", handleIncommingCall);
        socket.off("call:accepted", handleCallAccepted);
        socket.off("peer:nego:needed", handleNegoNeedIncomming);
        socket.off("peer:nego:final", handleNegoNeedFinal);
      };
    }, [
      socket,
      handleUserJoined,
      handleIncommingCall,
      handleCallAccepted,
      handleNegoNeedIncomming,
      handleNegoNeedFinal,
    ]);
    
    const toggleMute = () => {
      if (myStream) {
          myStream.getAudioTracks().forEach((track) => {
              track.enabled = !track.enabled;
          });
          setIsMuted(!isMuted);
      }
  };
    return (
    <>
        <h1>Host Room</h1>
        <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
        {myStream && (
            <button onClick={toggleMute}>
                {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                {isMuted ? " Unmute Microphone" : " Mute Microphone"}
            </button>
        )}
    </>)
}
const HostPage = connect(mapStateToProps, mapDispatchToProps)(HostBase);
export default HostPage;