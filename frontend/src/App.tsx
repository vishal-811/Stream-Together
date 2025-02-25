import { Toaster } from "sonner";
import { AppInitializer } from "./lib/AppInitializer";
import { RouterProvider } from "react-router-dom";
import Router from "./Router";

function App() {
  return (
    <>
      <Toaster />
      <AppInitializer/>
      <RouterProvider router={Router}/>
    </>
  );
}

export default App;
