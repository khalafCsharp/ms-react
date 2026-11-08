import { createPortal } from "react-dom";
import CreateAppoinmentForm from "./forms/CreateAppoinmentForm";
import RelocateAppointmentForm from "./forms/RelocateAppointmentForm";
import AppointmentDetailComponent from "./AppointmentDetailComponent";
import UpdateAppointmentServicesForm from "./forms/UpdateAppointmentServicesForm";
import ChangeLaborForm from "./forms/ChangeLaborForm";
import UpdateState from "./forms/UpdateState";

function AppointmentModal({ closePortal, formType, slot }) {
  let content;

  const startDateTime = new Date(slot.startAtUtc)
  switch (formType) {
    case "newAppointment": {
      content = <CreateAppoinmentForm closePortal={closePortal} slot={slot}  />;
      break;
    }
    case "relocateAppointment": {
      content = <RelocateAppointmentForm slot={slot} closePortal={closePortal} startDateTime={startDateTime}/>;
      break;
    }
    case "changeLabor": {
      content = (
        <ChangeLaborForm
          slot={slot}
          closePortal={closePortal}
        />
      );
      break;
    }
    case "updateServices": {
      content = (
        <UpdateAppointmentServicesForm
          slot={slot}
          closePortal={closePortal}
        />
      );
      break;
    }
    case "updateState": {
      content = (
        <UpdateState
          slot={slot}
          closePortal={closePortal}
        />
      );
      break;
    }
    case "showDetails": {
      content = (
        <AppointmentDetailComponent
          workOrderId={slot.workOrderId}
          closePortal={closePortal}
        />
      );
      break;
    }
  }
  return createPortal(
    // overlay
    <div
      onClick={() => {
        closePortal();
      }}
      className="fixed z-100 inset-0 backdrop-blur-md"
    >
      {/* portal */}
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="max-h-[75vh] w-fit overflow-y-auto p-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2   bg-background-light-opaque shadow-2xl rounded-2xl border border-border"
      >
        {content}
      </div>
    </div>,
    document.body,
  );
}

export default AppointmentModal