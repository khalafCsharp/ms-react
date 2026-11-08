function LandingPage() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 ">
      <div className="card ">
        <h3 className="text-text font-semibold mb-4 text-2xl ">
          General Maintenance
        </h3>
        <p className="">
          Oil changes, tire rotations, fluid checks, and more to keep your car
          running smoothly.
        </p>
      </div>

      <div className="card  ">
        <h3 className="font-semibold text-text mb-4 text-2xl ">
          Brake & Tire Services
        </h3>
        <p className="">
          Professional brake inspections, repairs, and new tire installations
          for your safety.
        </p>
      </div>
      <div className="card ">
        <h3 className="font-semibold mb-4 text-text text-2xl ">
          Engine Diagnostics
        </h3>
        <p className="">
          Advanced diagnostics to accurately identify and fix any engine
          performance issues.
        </p>
      </div>
      <div className="card ">
        <h3 className="font-semibold mb-4 text-text text-2xl ">
          Electrical System Repair
        </h3>
        <p className="">
          Resolving issues with your car's wiring, lights, battery, and charging
          system.
        </p>
      </div>
      <div className="card ">
        <h3 className="font-semibold mb-4 text-text text-2xl ">
          AC & Heating Repair
        </h3>
        <p className="">
          Ensuring your car's climate control system works perfectly year-round.
        </p>
      </div>
      <div className="card ">
        <h3 className="font-semibold mb-4 text-text text-2xl ">
          Pre-Purchase Inspections
        </h3>
        <p className="">
          Thorough inspections to give you peace of mind before buying a used
          vehicle.
        </p>
      </div>
    </div>
  );
}

export default LandingPage;
