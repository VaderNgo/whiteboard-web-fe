type HeaderBarProps = {
  onLogin?: () => void;
  onPricing?: () => void;
};

export default function HeaderBar({ onLogin, onPricing }: HeaderBarProps) {
  return (
    <nav className="md:px-16 h-16 w-full font-mono bg-white/80 z-[2] absolute top-0 lg:sticky p-5 flex flex-row gap-5 backdrop-blur-sm items-center pointer-events-none">
      <h1 className="font-bold md:text-2xl mr-auto pointer-events-none select-none">Teamscribe</h1>
      <button
        className="font-semibold text-sm md:text-base pointer-events-auto"
        onClick={onPricing}
      >
        Pricing
      </button>
      <button className="font-semibold text-sm md:text-base pointer-events-auto" onClick={onLogin}>
        Login
      </button>
    </nav>
  );
}
