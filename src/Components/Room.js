import React, { useEffect, useCallback, useState } from "react";
import peer from "./peer";
import { useSocket } from "./SocketProvider";
import { message } from "antd";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
// import axios from 'axios';
const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  // const [translatedStream, setTranslatedStream] = useState();

  const [isMuted, setIsMuted] = useState(false);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  // const translateAudio = async (audioChunks, targetLanguage) => {
  //     await axios.post('https://98.70.15.100:443/translate', {
  //       audio_chunk: audioChunks,
  //       target_language: targetLanguage
  //     })
  //     .then(response => {
  //       return response?.data?.translated_text;
  //    })
  //    .then(data => {
  //       console.log(data)
  //       setTranslatedStream(data);
  //       return data;
  //    })
  //    .catch(error => {
  //       console.log(error?.response?.data?.error,'error.response.data.error',error,'error')
  //    })
  // }

  const handleUserJoined = useCallback(({ email, id }) => {
    setRemoteSocketId(id);
  }, []);

  useEffect(() => {
    if (remoteSocketId) {
      handleCallUser();
    }
  }, [socket, remoteSocketId, handleCallUser]);

  // useEffect(() => {
  //   if (myStream) {
  //     translateAudio(myStream, 'en-US');
  //   }
  // }, [myStream, translateAudio]);

  // const handleIncommingCall = useCallback(
  //   async ({ from, offer }) => {
  //     setRemoteSocketId(from);
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       audio: true,
  //       video: false,
  //     });
  //     setMyStream(stream);
  //     // console.log(`Incoming Call`, from, offer);
  //     const ans = await peer.getAnswer(offer);
  //     socket.emit("call:accepted", { to: from, ans });
  //   },
  //   [socket]
  // );

  const sendStreams = useCallback(() => {
    if (myStream) {
      console.log('call sendStreams')
      for (const track of myStream.getTracks()) {
        peer.peer.addTrack(track, myStream);
      }
    }
  }, [myStream]);

  console.log(myStream, 'myStream')
  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    console.log('call peer:nego:needed')
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  // const handleNegoNeedIncomming = useCallback(
  //   async ({ from, offer }) => {
  //     console.log('call ')
  //     const ans = await peer.getAnswer(offer);
  //     socket.emit("peer:nego:done", { to: from, ans });
  //   },
  //   [socket]
  // );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    if (remoteSocketId)
      message.success('Both are successfully connected.');
  }, [remoteSocketId]);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    // socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    // socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    return () => {
      socket.off("user:joined", handleUserJoined);
      // socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      // socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    // handleIncommingCall,
    handleCallAccepted,
    // handleNegoNeedIncomming,
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
    <div>
      <h1>Host Room Page</h1>
      <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
      {myStream && (
        <button onClick={toggleMute}>
          {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          {isMuted ? " Unmute Microphone" : " Mute Microphone"}
        </button>
      )}
    </div>
  );
};

export default RoomPage;