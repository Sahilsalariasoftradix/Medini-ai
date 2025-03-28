import pill from "../assets/icons/pill.svg";
import medkit from "../assets/icons/medi-kit.svg";
import health from "../assets/icons/health.svg";
import heart from "../assets/icons/heart-rate.svg";
import home from "../assets/icons/Home.svg";
import sidebarlogo from "../assets/icons/sidebar-logo.svg";
import activity from "../assets/icons/Activity.svg";
import arrowdown from "../assets/icons/arrow-down.svg";
import billing from "../assets/icons/Billing.svg";
import patients from "../assets/icons/Patients.svg";
import history from "../assets/icons/History.svg";
import messages from "../assets/icons/Message.svg";
import settings from "../assets/icons/settings.svg";
import help from "../assets/icons/help.svg";
import callBooking from "../assets/icons/call-booking.svg";
import dinner from "../assets/icons/dinner.svg";
import office from "../assets/icons/office-booking.svg";
import clock from "../assets/icons/time.svg";
import link from "../assets/icons/link-icon.svg";
import plus from "../assets/icons/plus-icon.svg";
import dotsVertical from "../assets/icons/dots-vertical.svg";
import calendar from "../assets/icons/calender-date.svg";
import googleIcon from "../assets/icons/google-icon.svg";
import appleIcon from "../assets/icons/apple-icon.svg";
import hidden from "../assets/icons/eye-off.svg";
import visibile from "../assets/icons/eye-on.svg";
import verification from "../assets/icons/verification.svg";
import editForm from "../assets/icons/edit-form.svg";
import deleteIcn from "../assets/icons/delete-tr.svg";
export const Icons: {
  [key in "option1" | "option2" | "option3" | "option4"]: string;
} = {
  option1: pill, // Assuming 'pill' is the icon for Option 1
  option2: medkit, // 'medkit' icon for Option 2
  option3: health, // 'health' icon for Option 3
  option4: heart, // 'heart' icon for Option 4
};

export const SidebarIcons = {
  logo: sidebarlogo,
  home: home, // Assuming 'pill' is the icon for Option 1
  activity: activity,
  arrow: arrowdown,
  billing: billing,
  patients: patients,
  history: history,
  messages: messages,
  settings: settings,
  help: help, // 'help' icon for Option 4
  // Add more icons as needed
};
// Set availability option
export const availabilityIcons = {
  phone: callBooking,
  in_person: office,
  break: dinner,
};
export const editAvailabilityIcons = {
  clock: clock,
};

export const otherIcons = {
  link: link,
  plus: plus,
  dotsVertical: dotsVertical,
};

export const datePickerIcons = {
  calendar: calendar,
};
// Static Icons
export const GoogleIcon = <img alt="edit" src={googleIcon} />;
export const AppleIcon = <img alt="edit" src={appleIcon} />;
export const VisibilityOff = <img alt="edit" src={hidden} />;
export const Visibility = <img alt="edit" src={visibile} />;
export const InPersonIcon = () => (
  <img src={editAvailabilityIcons.clock} alt="icon" />
);
export const VerificationIcon = () => (
  <img src={verification} alt="icon" />
);
export const EditFormIcon = () => (
  <img src={editForm} alt="icon" />
);
export const DeleteIcon = () => (
  <img src={deleteIcn} alt="icon" />
);
