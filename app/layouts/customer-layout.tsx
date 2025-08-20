import { Outlet } from "react-router";
import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";

const DefaultLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default DefaultLayout;
