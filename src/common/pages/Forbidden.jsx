import { useAuth } from "@/features/identity/components/AuthProvider";
import { NavLink } from "react-router";

function Forbidden() {
    const {user} = useAuth()
  return (
    <div className="grid gap-8 p-8"><h1> {user.email}, You don't have required role for accessing that page</h1>
    
    <NavLink to="/" >Go to home</NavLink></div>
  )
}

export default Forbidden