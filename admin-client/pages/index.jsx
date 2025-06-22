import React, { useEffect } from "react";
import Router from "next/router";

const HomePage = () => {
  useEffect(() => {
    Router.push("/overview");
  }, []);

  return <div className="Home"></div>;
};

export default HomePage;
