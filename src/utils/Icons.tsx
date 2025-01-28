import pill from "../assets/icons/pill.svg";
import medkit from "../assets/icons/medi-kit.svg";
import health from "../assets/icons/health.svg";
import heart from "../assets/icons/heart-rate.svg";

export const Icons: { [key in 'option1' | 'option2' | 'option3' | 'option4']: string } = {
  option1: pill,    // Assuming 'pill' is the icon for Option 1
  option2: medkit,   // 'medkit' icon for Option 2
  option3: health,   // 'health' icon for Option 3
  option4: heart,    // 'heart' icon for Option 4
};
