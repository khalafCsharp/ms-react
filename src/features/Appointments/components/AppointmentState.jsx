import { convertState } from "@/common/utils";
import { Hourglass, TrafficCone, Check, CreditCardX } from "lucide-react";

function AppointmentState({ state }) {
  switch (state) {
    case 0:
      return (
        <div className="flex gap-2 text-warning">
          <Hourglass />
          <span>{convertState(state)}</span>
        </div>
      );
    case 1:
      return (
        <div className="flex gap-2 text-info">
          <TrafficCone />
          <span>{convertState(state)}</span>
        </div>
      );
    case 2:
      return (
        <div className="flex gap-2 text-success">
          <Check />
          <span>{convertState(state)}</span>
        </div>
      );
    case 3:
      return (
        <div className="flex gap-2 text-danger">
          <CreditCardX />
          <span>{convertState(state)}</span>
        </div>
      );
  }

  return <div>AppointmentState</div>;
}

export default AppointmentState;
