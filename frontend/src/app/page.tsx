"use client";

import React, { useState } from "react";
import SignUp from "@/components/signup";
import SignIn from "@/components/signin";

export default function Home() {
  const [isSignUp, setIsSignUp] = useState(true);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <main>
      {isSignUp ? (
        <SignUp toggleForm={toggleForm} />
      ) : (
        <SignIn toggleForm={toggleForm} />
      )}
    </main>
  );
}
