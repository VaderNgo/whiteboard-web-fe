import HeaderBar from "./_components/header-bar";
import InteractiveColorGrid from "./_components/interactive-color-grid";
import SignupButton from "./_components/signup-btn";
import TypewriterText from "./_components/typewriter-text";

const typewriterTexts = [
  "Make your team's ideas come to life",
  "Collaborate in real-time",
  "Share your whiteboard with anyone",
  "Made with love",
];

const Homepage = () => {
  return (
    <div className="h-full w-full flex min-h-screen flex-col overflow-x-hidden">
      <HeaderBar />
      <InteractiveColorGrid />

      {/* Header and animated typewriter text */}
      <h1 className="z-[1] font-mono self-center text-center font-bold text-2xl md:text-5xl mt-[15%] rounded-md pointer-events-none bg-white/80 backdrop-blur-sm p-5">
        A whiteboard designed for{" "}
        <span className="bg-blue-500 text-white px-2 rounded-md">teams</span>
        <TypewriterText texts={typewriterTexts} />
      </h1>

      {/* Signup button */}
      <SignupButton className="z-[1] font-mono font-bold w-fit mx-auto text-sm md:text-base bg-blue-500/80 backdrop-blur-sm" />
    </div>
  );
};

export default Homepage;
