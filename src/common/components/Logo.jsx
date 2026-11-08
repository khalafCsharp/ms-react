import { Link } from "react-router";

function Logo() {
  return (
    <div className="flex gap-1 items-center">
      <div className="w-2 h-10 rounded-3xl working-hours bg-green-700"></div>
      <Link to='/' className="grid leading-5 font-black ">
        <span>MECHANIC</span>
        <span>SHOP</span>
      </Link>
    </div>
  );
}

export default Logo;
