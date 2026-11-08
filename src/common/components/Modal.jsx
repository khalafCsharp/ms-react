import { createPortal } from "react-dom";
// import { handleScrollToTop } from "../utils";


function Modal({ children , setIsPortalOpen}) {
  
  return createPortal(
    // overlay
    <div
      onClick={() => {
        setIsPortalOpen(false);
      }}
      className="absolute z-100 inset-0 backdrop-blur-md"
    >
      {/* portal */}
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="max-h-[75vh] overflow-y-auto absolute top-1/2 md:text-2xl lg:inset-x-32 xl:inset-x-90  md:inset-x-12 inset-x-3 -translate-y-1/2 bg-background-light-opaque shadow-2xl rounded-2xl border border-border p-8"
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

 export default Modal;
