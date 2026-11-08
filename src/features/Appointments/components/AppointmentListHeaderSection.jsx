import logo from "@/assets/lens.svg";
import { defaultFilters } from "../queries";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";

function AppointmentListHeaderSection({ filters, setFilters, setAppliedFilters }) {

  function handleSearch() {
    setAppliedFilters({
      ...filters,
      page: 1,
    });
  }

  console.log(filters.startDate.toString());
  


  return (
    <section className="bg-background px-2 min-w-0">
      <div className="flex gap-1 items-center">
        <div className="w-2 h-18 bg-border rounded-lg"></div>
        <div className="">
          <h1 className="text-2xl  uppercase font-semibold text-text mb-1">
            Appointments
          </h1>
          <p className="text-text text-lg">Observe appointments</p>
        </div>
      </div>
      <hr className="text-gray-300 my-8" />
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8  items-center    gap-2   mb-4">
        <div className="relative rounded-2xl ">
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) =>
              setFilters((p) => ({ ...p, searchTerm: e.target.value }))
            }
            className="w-full text-text peer p-3  bg-background-light transition-all duration-200 outline-none rounded-lg text-xl min-w-0"
          />
          <img
            className={`right-3  duration-300 absolute w-8 top-1/2 -translate-y-1/2 `}
            src={logo}
            alt="magnifier search image"
          />
        </div>
        <select
          name=""
          className="outline-none text-text p-3  transition-all duration-200 rounded-md text-lg bg-background-light "
          id=""
          value={filters.state}
          onChange={(e) => setFilters((p) => ({ ...p, state: e.target.value }))}
        >
          <option value="">All Orders</option>
          <option value="Cancelled">Cancelled Orders</option>
          <option value="InProgress">In-Progress Orders</option>
          <option value="Scheduled">Scheduled Orders</option>
          <option value="Completed">Completed Orders</option>
        </select>
        <div className="grid grid-cols-2 col-span-2 gap-2">
          <select
            name=""
            className="outline-none text-text p-3  transition-all duration-200 rounded-md text-Sort by lg bg-background-light "
            id=""
            value={filters.sortColumn}
            onChange={(e) =>
              setFilters((p) => ({ ...p, sortColumn: e.target.value }))
            }
          >
            <option value="createdat">Sort by Creation date</option>
            <option value="updatedat">Sort by Last updated date</option>
            <option value="startat">Sort by Start date</option>
            <option value="endat">Sort by End date</option>
            <option value="state">Sort by State</option>
            <option value="spot">Sort by Spot</option>
            <option value="vehicleid">Sort by Vehicle</option>
            <option value="laborid">Sort by Labor</option>
          </select>
          <div className="grid grid-cols-2 gap-1 ">
            <button
              onClick={() =>
                setFilters((p) => ({ ...p, sortDirection: "asc" }))
              }
              className={`bg-background-light place-items-center p-2 hover:bg-gray-200 rounded-md transition-all duration-200 ${filters.sortDirection === "asc" ? "bg-primary" : ""}`}
            >
              <ArrowUpNarrowWide />
            </button>
            <button
              onClick={() =>
                setFilters((p) => ({ ...p, sortDirection: "desc" }))
              }
              className={`bg-background-light place-items-center p-2 hover:bg-gray-200 rounded-md transition-all duration-200 ${filters.sortDirection === "desc" ? "bg-primary" : ""}`}
            >
              <ArrowDownWideNarrow />
            </button>
          </div>
        </div>
        <div className="border border-border-dark w-fit p-1 col-span-2 rounded-lg">
          <div className="flex  gap-2">
            <label className="grid">
              From
              <input
                className="outline-none h-2 text-text p-3  transition-all duration-200 rounded-md text-lg bg-background-light   w-full min-w-12 "
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, startDate: e.target.value }))
                }
              />
            </label>
            <label className="grid">
              To
              <input
                className="outline-none h-2 text-text p-3  transition-all duration-200 rounded-md text-lg bg-background-light   w-full min-w-12"
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, endDate: e.target.value }))
                }
              />
            </label>
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="p-2 py-4 bg-background-light place-items-center border border-border duration-200 text-text transition-all hover:bg-background  rounded-md hover:border-primary"
        >
          Filter
        </button>
        <button
          onClick={() => {
            setFilters(defaultFilters);
          }}
          className="p-2 py-4 bg-background-light place-items-center border border-border duration-200 text-text transition-all hover:bg-background  rounded-md hover:border-primary"
        >
          Reset
        </button>
      </div>
    </section>
  );
}

export default AppointmentListHeaderSection;
