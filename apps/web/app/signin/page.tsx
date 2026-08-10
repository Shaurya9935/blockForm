import type { Metadata } from "next";
import { BlockWorldLandscape } from "~/components/register/block-world-landscape";
import { SignInRightPanel } from "~/components/signin/signin-form";

export const metadata: Metadata = {
  title: "Sign In — BlockForm",
  description: "Sign in to your BlockForm account and continue building forms.",
};

export default function SigninPage() {
  return (
    <div
      className="register-split"
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#0d1117',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* LEFT — World landscape */}
      <div
        className="register-left"
        style={{
          flex: '0 0 58%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <BlockWorldLandscape />
      </div>

      {/* RIGHT — Sign in card */}
      <SignInRightPanel />
    </div>
  );
}
