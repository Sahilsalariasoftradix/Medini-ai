import { EnBookings } from "../../utils/enums";
import available from "../../assets/icons/available.svg";
import cancel from "../../assets/icons/cancelled.svg";
import active from "../../assets/icons/active.svg";
import unconfirmed from "../../assets/icons/unconfirmed.svg";

export // To get icon according to the status
const StatusIcon: React.FC<{
  status: EnBookings;
  handleClick?: (event: React.MouseEvent<HTMLElement>) => void;
}> = ({ status }) => {
  let icon;

  switch (status) {
    case EnBookings.Available:
      icon = available;
      break;
    case EnBookings.Active:
      icon = active;
      break;
    case EnBookings.Cancelled:
      icon = cancel;
      break;
    case EnBookings.Unconfirmed:
      icon = unconfirmed;
      break;
    default:
      icon = available;
  }

  return <img src={icon} alt={icon} />;
};
