
import { useAuth } from "@/features/identity/components/AuthProvider";
import { NavLink, useNavigate } from "react-router";
import ThemeToggler from "../theme/ThemeToggler";
import {  LogOut } from "lucide-react";
import { queryClient } from "../queryClient";

function NavigationMenu() {

    const navigate = useNavigate()

    const { user, logout } = useAuth();
  return (
    <div className="hidden lg:flex lg:justify-around text-xl  overflow-hidden  ">
      {user && (
        <ul className="flex justify-between items-center px-2 bg-background">
          <li className="navigation-menu-li">
            <NavLink to="/services">Services</NavLink>
          </li>
          <li className="navigation-menu-li">
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
          <li className="navigation-menu-li">
            <NavLink to="customers">Customers</NavLink>
          </li>
          <li className="navigation-menu-li">
            <NavLink to="schedule">Schedule</NavLink>
          </li>
          <li className="navigation-menu-li">
            <NavLink to="appointmentlist">Appointments</NavLink>
          </li>
        </ul>
      )}
      <ul className="flex justify-around px-2 ">
        <li className="navigation-menu-li">
          <ThemeToggler size="6" />
        </li>
        <li className="navigation-menu-li">
          {user ? (
            <button
              onClick={() => {
                logout();
                queryClient.clear();
                navigate("/");
              }}
              className=" justify-center flex items-center gap-1"
            >
              <LogOut className="size-6" />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("login");
              }}
              className="text-xl uppercase cursor-pointer"
            >
              Login
            </button>
          )}
        </li>
      </ul>
    </div>
  );
}

export default NavigationMenu