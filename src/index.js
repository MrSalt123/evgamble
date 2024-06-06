import * as React from "react";
import * as ReactDOM from "react-dom/client";
import Home from "./components/Home";
import Bankroll from "./components/Bankroll";
import Register from "./components/Register";
import Login from "./components/Login";
import News from "./components/News";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import "./components/styles/index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: "/bankroll",
    element: <Bankroll />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/news',
    element: <News />,
  },
  {
    path: '/profile',
    element: <Profile />
  }

]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <Navbar />
    <RouterProvider router={router} />
  </React.StrictMode>
);