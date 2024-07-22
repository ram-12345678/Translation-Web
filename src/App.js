import "./App.css";
import HomePage from "./Components/Home";
// import  HostPage  from "./Components/HostRoom";
// import ListenerRoomPage from "./Components/ListenerRoom";
import RoomPage from "./Components/Room";
import { SocketProvider } from "./Components/SocketProvider";
import { BrowserRouter, useRoutes } from "react-router-dom";

const AppRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/room/:romeId', element: <RoomPage /> },
    // { path: '/ListenerRoom/:profileId', element: <ListenerRoomPage /> },
    // Add more routes here
  ]);
  return routes;
};

const App = () => (
  <div className="App">
    <BrowserRouter>
      <SocketProvider>
      <AppRoutes />
      </SocketProvider>
    </BrowserRouter>
  </div>
);

export default App;
