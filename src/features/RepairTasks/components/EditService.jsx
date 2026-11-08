import { handleScrollToTop } from "@/common/utils";
import { UserPen } from "lucide-react";

function EditService({ onClick }) {
  return (
    <button
      onClick={ ()=>{onClick(); handleScrollToTop()} }
      className="flex justify-around items-center py-2 px-4 bg-primary text-text transition-all hover:bg-primary-hovered rounded-lg"
    >
      <UserPen />
      <span className="">Edit</span>
    </button>
  );
}

export default EditService;
