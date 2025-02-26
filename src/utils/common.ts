// Function to get pathname for page
export const getPageNameFromPath = (path: string) => {
  const pathSegment = path.split("/")[1] || "Dashboard";
  return pathSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
// Function for max form heights
export const getMaxHeight = () => ({
  maxHeight: {
    xs:"calc(100vh - 200px)",
    lg: "580px",
    xl: "100%",
  },
});
