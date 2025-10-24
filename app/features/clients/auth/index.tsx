// import React, { useState } from "react";
// import LoginPage from "./login";
// import RegisterPage from "./register";
// import ForgotPasswordPage from "./forgot";

// export default function AuthContainer() {
//   const [currentView, setCurrentView] = useState<"login" | "register" | "forgot">("login");

//   const handleNavigateToRegister = () => setCurrentView("register");
//   const handleNavigateToLogin = () => setCurrentView("login");
//   const handleNavigateToForgot = () => setCurrentView("forgot");

//   return (
//     <>
//       {currentView === "login" && (
//         <LoginPage
//           onNavigateToRegister={handleNavigateToRegister}
//           onNavigateToForgot={handleNavigateToForgot}
//         />
//       )}
//       {currentView === "register" && (
//         <RegisterPage onNavigateToLogin={handleNavigateToLogin} />
//       )}
//       {currentView === "forgot" && (
//         <ForgotPasswordPage onNavigateToLogin={handleNavigateToLogin} />
//       )}
//     </>
//   );
// }
