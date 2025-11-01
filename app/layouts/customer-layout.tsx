import { Outlet } from "react-router";
import { useEffect } from "react";
import { useAppDispatch } from "~/redux/store";
import { fetchHomePageData } from "~/redux/slices/home-page";
import Footer from "~/components/layouts/footer";
import Header from "~/components/layouts/header";
import Chatbox from "~/features/clients/chatbox";

const DefaultLayout = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchHomePageData());
  }, [dispatch]);

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
