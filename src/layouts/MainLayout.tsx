import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      sidebar
      <Outlet />
    </div>
  );
};

export default MainLayout;
