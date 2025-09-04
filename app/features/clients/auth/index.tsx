import React, { useState } from "react";
import LoginPage from "./login";
import RegisterPage from "./register";

export default function AuthContainer() {
  const [currentView, setCurrentView] = useState<"login" | "register">("login");

  const handleNavigateToRegister = () => {
    setCurrentView("register");
  };

  const handleNavigateToLogin = () => {
    setCurrentView("login");
  };

  return (
    <>
      {currentView === "login" ? (
        <LoginPage onNavigateToRegister={handleNavigateToRegister} />
      ) : (
        <RegisterPage onNavigateToLogin={handleNavigateToLogin} />
      )}
    </>
  );
}
