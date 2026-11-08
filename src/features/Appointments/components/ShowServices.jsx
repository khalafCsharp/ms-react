
function ShowServices({services}) {

    const output = services.map((s,index) => (
      <p key={index} className="p-1  whitespace-nowrap  font-semibold rounded-2xl text-success bg-background-light">
        {s}
      </p>
    ));
  return <div className="flex gap-1 flex-wrap">{output}</div>;
}

export default ShowServices;