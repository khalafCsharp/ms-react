
function AppointmentsTable({children}) {
  
    return (
      <table className="w-full ">
        <thead className="border-b border-border text-lg uppercase">
          <tr className="">
            <th className="p-3">Vehicle</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Spot</th>
            <th className="p-3">Labor</th>
            <th className="p-3">Services</th>
            <th className="p-3">State</th>
            <th className="p-3 min-w-80">Date&Time</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody className="">
          {children}
        </tbody>
      </table>
    );
}

export default AppointmentsTable