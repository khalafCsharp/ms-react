import { Menu, X } from "lucide-react";
import MobileNavigationMenu from "./MobileNavigationMenu";

import Logo from './Logo'
import NavigationMenu from "./NavigationMenu";

function Header({isMenuOpen, setIsMenuOpen}) {

  return (
    <header className="fixed left-0 top-0 right-0  bg-background-light border-b border-b-highlighted backdrop-blur-md p-4 px-6  text-2xl z-90 shadow-sm">
      <div
        className={`flex justify-between items-center ${isMenuOpen && "pb-4"}`}
      >
        <Logo />
        <button
          className="grid place-items-center transition-all duration-200 lg:hidden hover:bg-background-dark  p-3 rounded-2xl cursor-pointer"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X className="size-8" /> : <Menu className="size-8" />}
        </button>
        <NavigationMenu />
      </div>
      <MobileNavigationMenu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
    </header>
  );
}

export default Header;
