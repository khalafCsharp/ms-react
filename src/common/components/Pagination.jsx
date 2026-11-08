import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ pageNumber, totalPages, rowsNumber, setAppliedFilters }) {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between p-4 text-2xl">
      {rowsNumber !== 0 ? (
        <p>
          Found <span className="text-info">{rowsNumber}</span> appointments in{" "}
          <span className="text-info">{totalPages}</span> pages
        </p>
      ) : (
        <p>no appointments found</p>
      )}
      {rowsNumber > 0 ? (
        <div className="flex justify-between gap-4 items-center">
          <button
            disabled={pageNumber === 1}
            onClick={() => {
              setAppliedFilters((p) => ({ ...p, page: --pageNumber }));
            }}
            className=" flex items-center gap-2 p-3 hover:bg-background-dark rounded-xl transition-all duration-200"
          >
            <span className="">
              <ChevronLeft />
            </span>
            <span>previous</span>
          </button>
          <span className="border border-border px-2 py-1 rounded-md">
            {" "}
            {pageNumber}
          </span>
          <button
            disabled={pageNumber === totalPages}
            onClick={() => {
              setAppliedFilters((p) => ({ ...p, page: ++pageNumber }));
            }}
            className=" flex items-center gap-2 p-3 hover:bg-background-dark rounded-xl transition-all duration-200"
          >
            <span>next</span>
            <span>
              <ChevronRight />
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default Pagination;
