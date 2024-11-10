import * as React from "react";
import * as ReactDOM from "react-dom/client";
import Home from "./components/Home";
import Bankroll from "./components/Bankroll";
import Register from "./components/Register";
import Login from "./components/Login";
import News from "./components/News";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Layout from "./components/Layout";
import "./components/styles/index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<Layout>
				<Home />
			</Layout>
		),
	},
	{
		path: "/bankroll",
		element: (
			<Layout>
				<Bankroll />
			</Layout>
		),
	},
	{
		path: '/login',
		element: (
			<Layout>
				<Login />
			</Layout>
		),
	},
	{
		path: '/register',
		element: (
			<Layout>
				<Register />
			</Layout>
		),
	},
	{
		path: '/news',
		element: (
			<Layout>
				<News />
			</Layout>
		),
	},
	{
		path: '/profile',
		element: (
			<Layout>
				<Profile />
			</Layout>
		),
	}
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
