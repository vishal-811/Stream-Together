import { Toaster } from "sonner";
import { RouterProvider } from "react-router-dom";
import Router from "./Router";

function App() {
  return (
    <>
      <Toaster />
      <RouterProvider router={Router}/>
    </>
  );
}

export default App;
