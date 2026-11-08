
import { useAuth } from "@/features/identity/components/AuthProvider";
import LandingPage from "../components/LandingPage";
import Dashboard from "@/features/dashboard/pages/Dashboard";

function Home() {

  const {user} = useAuth();
  if(user)
  {
    return <div className="px-4">
      <Dashboard/>
    </div>
  }
  // if user is logged in then return dashboard else return landing page
  return (
    <div className="px-4">
      <LandingPage />
    </div>
  );
}

export default Home;
