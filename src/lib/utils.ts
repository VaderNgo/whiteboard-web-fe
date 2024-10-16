import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Plan } from "./plans-enum";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPlanDetails(plan?: Plan) {
  switch (plan) {
    case "FREE":
      return {
        maxOwnedTeams: 1,
        maxMembersPerTeam: 3,
      };
    case "STANDARD":
      return {
        maxOwnedTeams: 5,
        maxMembersPerTeam: 10,
      };
    case "PREMIUM":
      return {
        maxOwnedTeams: 15,
        maxMembersPerTeam: 25,
      };
    default:
      return {
        maxOwnedTeams: 0,
        maxMembersPerTeam: 0,
      };
  }
}
