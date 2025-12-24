import { FaMapLocationDot, FaPhoneVolume } from "react-icons/fa6";
import { LuMails } from "react-icons/lu";

const boxData = [
  {
    id: 1,
    link: "https://maps.app.goo.gl/wPBuAVZRvwawaDGx8",
    icon: <FaMapLocationDot />,
    boxTitle: "Our Location",
    details: "LPU, Phagwara, Punjab",
    target: "_blank",
  },
  {
    id: 2,
    link: "tel:+1234567890",
    icon: <FaPhoneVolume />,
    boxTitle: "Contact Us",
    details: "(123) 456 7890",
  },
  {
    id: 3,
    link: "mailto:contact@fitnessclub.com",
    icon: <LuMails />,
    boxTitle: "Email Us",
    details: "contact@fitnessclub.com",
  },
];

export default boxData;
