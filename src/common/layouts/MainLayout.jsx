import { Outlet } from "react-router";
import { useState } from "react";
import Header from "../components/Header";
// import MobileNavigationMenu from "../components/MobileNavigationMenu";

function MainLayout() {

 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="relative w-full min-h-screen bg-background-dark text-text">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main onClick={()=>setIsMenuOpen(false)} className={`relative px-4 pt-24 ${isMenuOpen && "h-screen overflow-hidden"}`}>
      
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
