"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

interface SignInButtonProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function SignInButton({ children, style }: SignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <button
      onClick={() => {
        setIsLoading(true);
        signIn("google", { redirectTo: "/dashboard" });
      }}
      disabled={isLoading}
      style={{
        ...style,
        cursor: isLoading ? "wait" : "pointer",
        opacity: isLoading ? 0.7 : 1,
      }}
    >
      {isLoading ? (
        <>
          <span
            style={{
              display: "inline-block",
              width: "16px",
              height: "16px",
              border: "2px solid rgba(255,255,255,0.3)",
              borderTop: "2px solid #fff",
              borderRadius: "50%",
              animation: "spinCW 0.8s linear infinite",
            }}
          />
          Redirecting...
        </>
      ) : (
        children
      )}
    </button>
  );
}
