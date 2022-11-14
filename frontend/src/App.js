import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import SetAvatar from "./pages/SetAvatar";
import Search from "./pages/Search";
import VideoChat from "./pages/VideoChat";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
        <Route path="/" element={<Chat />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile/:username" element={<Profile />} />
        {/* <Route path="/videoCall/:id" element={<VideoChat />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
