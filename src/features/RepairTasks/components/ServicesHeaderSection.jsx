
import logo from "@/assets/lens.svg";
import { ArrowUpNarrowWide, ArrowDownWideNarrow } from "lucide-react";
import CreateService from "./CreateService";

function ServicesHeaderSection({
  searchTerm,
  handleSearchTermChange,
  isDescending,
  setIsDescending,
  sortBy,
  setSortBy,
  onCreateClick,
}) {
  return (
    <section className="bg-background p-2 ">
      <div className="flex justify-between items-center">
        <div className="">
          <h1 className="text-2xl  uppercase font-semibold text-text mb-2">
            Services
          </h1>
          <p className="text-text text-lg">
            Manage services and their requirements
          </p>
        </div>

        <CreateService onCreateClick={onCreateClick} />
      </div>
      <hr className="text-gray-300 my-8" />
      <div className="md:w-3/4  bg-background lg:w-3/5 grid grid-cols-5 md:grid-cols-6 items-center   md:gap-8 gap-2   mb-4">
        <div className="relative col-span-2  md:col-span-3 rounded-2xl  ">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="w-full text-black peer p-3 bg-background-light transition-all duration-200 outline-none rounded-lg text-xl min-w-0"
          />
          <img
            className={`right-3  duration-300 absolute w-8 top-1/2 -translate-y-1/2 `}
            src={logo}
            alt="magnifier search image"
          />
        </div>

        <select
          name=""
          className="outline-none text-text p-3 col-span-2 transition-all duration-200 rounded-md text-lg bg-background-light"
          id=""
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Sort By Name</option>
          <option value="taskDurationInMinutes">
            Sort By Service Duration
          </option>
          <option value="totalCost">Sort By Total-Cost</option>
          <option value="laborCost">Sort By Labor-Cost</option>
          <option value="partsCount">Parts Count</option>
        </select>

        <div className="grid grid-cols-2 gap-1 ">
          <button
            onClick={() => setIsDescending(false)}
            className={`bg-background-light place-items-center p-3 hover:bg-gray-200 rounded-md transition-all duration-200 ${isDescending ? "" : "bg-primary"}`}
          >
            <ArrowUpNarrowWide />
          </button>
          <button
            onClick={() => setIsDescending(true)}
            className={`bg-background-light place-items-center p-3 hover:bg-gray-200 rounded-md transition-all duration-200 ${isDescending ? "bg-primary" : ""}`}
          >
            <ArrowDownWideNarrow />
          </button>
        </div>
      </div>
    </section>
  );
}

export default ServicesHeaderSection;
