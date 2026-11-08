import { NavLink, useNavigate } from "react-router";
import { LogOut, KeyRound } from "lucide-react";
import { useAuth } from "@/features/identity/components/AuthProvider";
import { queryClient } from "../queryClient";
import ThemeToggler from "../theme/ThemeToggler";

function MobileNavigationMenu({ isMenuOpen, setIsMenuOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div
      onClick={() => setIsMenuOpen(false)}
      className={`lg:hidden text-text grid transition-[grid-template-rows] duration-300 ease-in-out ${isMenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
    >
      <div className=" text-4xl overflow-hidden bg-background">
        {user && (
          <ul className="grid px-4 py-4 bg-background">
            <li className="mobile-navigation-li">
              <NavLink onClick={() => setIsMenuOpen(false)} to="/services">
                Services
              </NavLink>
            </li>
            <li className="mobile-navigation-li">
              <NavLink onClick={() => setIsMenuOpen(false)} to="/dashboard">
                Dashboard
              </NavLink>
            </li>
            <li className="mobile-navigation-li">
              <NavLink onClick={() => setIsMenuOpen(false)} to="customers">
                Customers
              </NavLink>
            </li>
            <li className="mobile-navigation-li">
              <NavLink onClick={() => setIsMenuOpen(false)} to="schedule">
                Schedule
              </NavLink>
            </li>
            <li className="mobile-navigation-li">
              <NavLink
                onClick={() => setIsMenuOpen(false)}
                to="appointmentlist"
              >
                Appointments
              </NavLink>
            </li>
          </ul>
          
        )}
        <ul className="grid px-8 py-4 bg-background">
          <li className="mobile-navigation-li">
            <ThemeToggler size='12' />
          </li>
          <li className="mobile-navigation-li">
            {user ? (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                  queryClient.clear();
                  navigate("/");
                }}
                className=" justify-center flex items-center gap-4"
              >
                <LogOut className="size-6" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("login");
                }}
                className=" justify-center flex items-center gap-4"
              >
                <KeyRound className="size-6" />
                <span>Login</span>
              </button>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MobileNavigationMenu;
