import React, { useEffect, useCallback, useState } from "react";
import peer from "./peer";
import { useSocket } from "./SocketProvider";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { postData } from "../store/axiosApiCall/axiosApiCall";
import { message as antMessage } from "antd";

const RoomPageBase = (props) => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [isMuted, setIsMuted] = useState(false);
  const { profileId, languageCode } = props;
  const dispatch = useDispatch();

  let recognition;
  let recording = false;
  let lastTranscript = '';

  const handleUserJoined = useCallback(({ email, id }) => {
    setRemoteSocketId(id);
  }, []);

  const initializeRecognition = () => {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = languageCode;
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = function (event) {
      let transcript = event.results[event.resultIndex][0].transcript.trim();
      if (transcript && transcript !== lastTranscript) {
        lastTranscript = transcript;
        // document.getElementById('recognized-text').innerText = transcript;
        dispatch(postData({ text: transcript, lang: languageCode }));
      }
    };

    recognition.onerror = function (event) {
      console.error('Speech recognition error', event.error);
    };
  }

  const startRecording = () => {
    if (!recording) {
      initializeRecognition();
      recognition.start();
      recording = true;
      // document.getElementById('start-record-btn').style.display = 'none';
      // document.getElementById('stop-record-btn').style.display = 'inline-block';
    }
  }

  const stopRecording = () => {
    if (recording) {
      // Uncomment the next line if you want to stop recognition explicitly
      // recognition.stop();
      recording = false;
      // document.getElementById('start-record-btn').style.display = 'inline-block';
      // document.getElementById('stop-record-btn').style.display = 'none';
      lastTranscript = '';
    }
  }

  const handleCallUser = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    if (remoteSocketId) {
      handleCallUser();
    }
  }, [socket, remoteSocketId, handleCallUser]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
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

  const sendStreams = useCallback(() => {
    if (myStream) {
      for (const track of myStream.getTracks()) {
        peer.peer.addTrack(track, myStream);
      }
    }
  }, [myStream]);

  console.log(myStream, 'myStream')

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
    setIsMuted(!isMuted);
  }
  useEffect(() => {
    if (isMuted) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isMuted])

  return (
    <div>
      {/* {remoteSocketId && <button onClick={handleCallUser}>Call</button>} */}
      {profileId === 1 ? <>
        <h1>Host Room</h1>
        <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
        {myStream && (
          <button onClick={toggleMute}>
            {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            {isMuted ? " Unmute Microphone" : " Mute Microphone"}
          </button>
        )}
      </> :
        <>
          <h1>Listener Room</h1>
          <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
          {remoteStream && (
            <>
              <h1>Remote Audio Stream</h1>
              <audio
                controls
                autoPlay
                muted={false}
                ref={(audio) => {
                  if (audio && remoteStream) {
                    audio.srcObject = remoteStream;
                  }
                }}
              />
            </>
          )}
        </>
      }
    </div>
  );
};
// const RoomPage = connect(mapStateToProps, mapDispatchToProps)
const RoomPage = RoomPageBase;
export default RoomPage;