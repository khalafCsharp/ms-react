import { Plus } from "lucide-react";
import useHasRole from "@/features/identity/hooks/useHasRole";


function CreateCustomer({ onCreateClick }) {
  const isManager = useHasRole("Manager");
  return (
    <button
      onClick={onCreateClick}
      className={`flex gap-1 justify-around items-center primary-button ${isManager ? "" : "bg-primary-disabled cursor-not-allowed"}`}
      disabled={!isManager}
      title={!isManager ? "Manager specific actions" : undefined}
    >
      <Plus />
      <span>New</span>
      <span className="hidden md:flex">Customer</span>
    </button>
  );
}

export default CreateCustomer;
