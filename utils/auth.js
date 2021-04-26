import { useEffect } from "react";
import Router from "next/router";

export const signin = ({ email }) => {
  Router.push("/feed");
};

export const logout = async () => {
  await fetch("/api/logout");

  window.localStorage.setItem("logout", Date.now());

  Router.push("/signin");
};

export const withAuthSync = (Component) => {
  const Wrapper = (props) => {
    const syncLogout = (event) => {
      if (event.key === "logout") {
        console.log("logged out from storage!");
        Router.push("/signin");
      }
    };

    useEffect(() => {
      window.addEventListener("storage", syncLogout);

      return () => {
        window.removeEventListener("storage", syncLogout);
        window.localStorage.removeItem("logout");
      };
    }, []);

    return <Component {...props} />;
  };

  return Wrapper;
};
