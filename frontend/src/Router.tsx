import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/Home";
import StreamSyncSignIn from "./pages/Signin";
import StreamSyncSignup from "./pages/Signup";
import { Protected } from "./ProtectedRoute";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/signin",
    element: <StreamSyncSignIn />,
  },
  {
    path: "/signup",
    element: <StreamSyncSignup />,
  },
  {
    element: <Protected />,
    // children: [
    //   {
    //     path: "/upload",
    //     element: <UploadPage />,
    //   },
    //      {
    //         path: "/createRoom",
    //         element: <CreateRoomPage/>
    //      },
    //      {
    //         path: "/JoinRoom/:RoomId",
    //         element: <JoinRoom/>
    //      }
    // // ],
  },
]);

export default Router;
