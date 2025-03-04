import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/Home";
import StreamSyncSignIn from "./pages/Signin";
import StreamSyncSignup from "./pages/Signup";
import { Protected } from "./ProtectedRoute";
import { UploadPage } from "./pages/Upload";
import { UserAllVideos } from "./pages/UserAllVideo";
import { Room } from "./pages/Room";
import CreateRoom from "./pages/CreateRoom";

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
    children: [
      {
        path: "/upload",
        element: <UploadPage />,
      },
      {
        path: "/allvideos",
        element: <UserAllVideos />,
      },
      {
        path: "/createRoom",
        element: <CreateRoom />,
      },
      {
        path: "/room/:roomId",
        element: <Room />,
      },
    ],
  },
]);

export default Router;
