import "./App.css";
import HomePage from "./Components/Home";
import  HostPage  from "./Components/HostRoom";
import ListenerRoomPage from "./Components/ListenerRoom";
import { SocketProvider } from "./Components/SocketProvider";
import { BrowserRouter, useRoutes } from "react-router-dom";

const AppRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/hostRoom/:profileId', element: <HostPage /> },
    { path: '/ListenerRoom/:profileId', element: <ListenerRoomPage /> },
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
