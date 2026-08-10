import type { Metadata } from "next";
import { BlockWorldLandscape } from "~/components/register/block-world-landscape";
import { RegisterRightPanel } from "~/components/register/register-form";

export const metadata: Metadata = {
  title: "Sign Up — BlockForm",
  description: "Create your BlockForm account and start building beautiful forms, block by block.",
};

export default function SignupPage() {
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

      {/* RIGHT — Registration card */}
      <RegisterRightPanel />
    </div>
  );
}
