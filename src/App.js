import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./Components/Home";
import RoomPage from "./Components/Room";
import ListenerRoomPage from "./Components/ListenerRoom";

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
          <Route path="/listenerRoom/:roomId" element={<ListenerRoomPage />} />
        </Routes>
    </div>
  );
}

export default App;