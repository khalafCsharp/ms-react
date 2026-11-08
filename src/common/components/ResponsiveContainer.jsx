
function ResponsiveContainer({children}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 ">
      {children}
    </div>
  );
}

export default ResponsiveContainer