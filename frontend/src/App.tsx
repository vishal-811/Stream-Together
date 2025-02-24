import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { HomePage } from "./pages/Home";
import StreamSyncSignIn from "./pages/Signin";
import StreamSyncSignup from "./pages/Signup";
import { AppInitializer } from "./lib/AppInitializer";

function App() {
  return (
    <>
      <Toaster />
      <AppInitializer/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<StreamSyncSignIn />} />
          <Route path="/signup" element={<StreamSyncSignup />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
