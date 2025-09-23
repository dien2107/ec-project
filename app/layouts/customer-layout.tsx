import { Outlet } from "react-router";
import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import Chatbox from "~/features/clients/chatbox";
const DefaultLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <Chatbox />
    </>
  );
};

export default DefaultLayout;
