import React from "react";
import Home from "./components/Banner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BookNook | Home",
};

const HomePage = () => {
  return (
    <div>
      <Home />
    </div>
  );
};

export default HomePage;