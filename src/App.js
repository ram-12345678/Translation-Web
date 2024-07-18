import "./App.css";
import HomePage from "./Components/Home";
import RoomPage from "./Components/Room";
import { SocketProvider } from "./Components/SocketProvider";
import { BrowserRouter, useRoutes } from "react-router-dom";

const AppRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/room/:roomId', element: <RoomPage /> },
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
