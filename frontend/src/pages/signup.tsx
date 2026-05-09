import SignupForm from "../components/signupForm";

const Signup = () => {
  return (
    <div className="relative flex min-h-[calc(100vh-65px)] w-full items-center justify-center overflow-hidden bg-slate-950 px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.35),_transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.3),_transparent_50%)]" />
      <div className="relative z-10 w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
