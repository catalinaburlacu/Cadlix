import { NavLink, Outlet } from "react-router-dom";
import SidebarLayout from "../../../components/layout/SidebarLayout.jsx";
import "./Profile.css";

const profileSubnav = (
  <nav className="page-subnav" aria-label="Account navigation">
    <NavLink to="/profile/watching" className={({ isActive }) => `page-subnav-link${isActive ? " active" : ""}`}>
      Profile
    </NavLink>
    <NavLink to="/subscriptions" className={({ isActive }) => `page-subnav-link${isActive ? " active" : ""}`}>
      Subscriptions
    </NavLink>
  </nav>
);

export default function Profile() {
  return (
    <SidebarLayout navbarContent={profileSubnav}>
      <Outlet />
    </SidebarLayout>
  );
}
