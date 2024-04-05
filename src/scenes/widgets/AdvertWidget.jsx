import { Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { serverUrl } from "../../config";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src={`${serverUrl}/assets/Ironhack-1-1.png`}
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>Iron Hack</Typography>
        <Typography color={medium}>ironhack.com</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
      Learn Web Development, UX/UI, and Data Analytics with Ironhack Miami. 
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;