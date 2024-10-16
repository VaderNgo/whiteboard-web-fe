type PlanTagProps = {
  plan: "FREE" | "STANDARD" | "PREMIUM";
};

export const PlanTag = ({ plan }: PlanTagProps) => {
  const planStyles = {
    FREE: "bg-blue-500",
    STANDARD: "bg-green-500",
    PREMIUM: "bg-yellow-500",
  };

  return (
    <div className={`text-white text-xs p-1 h-full rounded-md ${planStyles[plan]}`}>{plan}</div>
  );
};
