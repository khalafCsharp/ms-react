import { useAuth } from "../components/AuthProvider";

function useHasRole(...allowedRoles) {

    const {user} = useAuth()
  return Boolean(user?.roles?.some((role) => allowedRoles.includes(role)));
}

export default useHasRole