import { LoaderCircle, Mail, Search, Users } from "lucide-react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetTeamMembers, useLoggedInUser } from "@/lib/services/queries";
import { useState } from "react";
import { Member } from "./member";
import { useInviteMember } from "@/lib/services/mutations";
import { AxiosError } from "axios";
import { DialogTitle } from "@radix-ui/react-dialog";

export const MembersDialog = ({ teamId }: { teamId: string }) => {
  const [searchInput, setSearchInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const data = useGetTeamMembers(teamId).data;
  const loggedInUserId = useLoggedInUser().data?.id;
  const teamOwnerId = data?.currentMembers.find((member) => member.role === "OWNER")?.id;
  const inviteMember = useInviteMember();

  const filteredCurrentMembers = searchInput
    ? data?.currentMembers.filter((member) =>
        member.name.toLowerCase().includes(searchInput.toLowerCase())
      )
    : data?.currentMembers;

  const filteredPendingMembers = searchInput
    ? data?.pendingMembers.filter((member) =>
        member.name.toLowerCase().includes(searchInput.toLowerCase())
      )
    : data?.pendingMembers;

  const handleInviteMember = async () => {
    try {
      await inviteMember.mutateAsync({ teamId, recipientEmail: emailInput });
      setError("");
      setSuccess(`Successfully sent an invitation to ${emailInput}`);
      setEmailInput("");
    } catch (err) {
      const error = err as AxiosError;
      if (error.message === "Recipient not found") {
        setError(
          "Cannot invite user. The provided email is not associated with any teamscribe user."
        );
      } else if (error.message === "Invite already sent") {
        setError("Cannot invite user. The provided email is already associated with this team.");
      } else if (error.message === "Validation failed")
        setError("Cannot invite user. The provided email is not valid.");
      else if (error.message === "You cannot invite yourself")
        setError("Cannot invite user. You cannot invite yourself");
      else setError("An error occurred while sending the invitation.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full hover:bg-slate-200 bg-transparent px-2 border-none font-normal"
        >
          <div className="flex items-center w-full">
            <Users className="mr-2" size={25} />
            <p className="">Members</p>
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-dvh flex flex-col" aria-describedby={undefined}>
        <DialogTitle>
          <div className="text-xl font-bold">Members</div>
        </DialogTitle>
        {error && <pre className="font-mono text-red-500 text-wrap">{error}</pre>}
        {success && <pre className="font-mono text-green-500 text-wrap">{success}</pre>}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="w-full max-w-[516px] pl-9"
            placeholder="Search members"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
        </div>

        <div className="flex">
          <div className="flex-1 relative">
            <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="w-full max-w-[516px] pl-9"
              placeholder="Email"
              type="email"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
              }}
            />
          </div>
          <Button
            disabled={inviteMember.isPending || !emailInput}
            className="ml-2 bg-blue-500 hover:bg-blue-600 w-16"
            onClick={() => handleInviteMember()}
          >
            {inviteMember.isPending ? (
              <LoaderCircle className="animate-spin" size={20} />
            ) : (
              "Invite"
            )}
          </Button>
        </div>

        <div className="flex flex-col gap-5 pr-4 max-h-64 overflow-scroll">
          {filteredCurrentMembers
            ?.sort((a, b) => {
              if (a.role === "OWNER") return -1;
              if (b.role === "OWNER") return 1;
              return 0;
            })
            .map((member) => (
              <Member
                teamId={teamId}
                userId={member.id.toString()}
                key={member.id}
                avatarUrl={member.avatar}
                name={member.name}
                email={member.email}
                role={member.role}
                className="h-12"
                showActions={loggedInUserId ? loggedInUserId === teamOwnerId : false}
              />
            ))}

          {filteredPendingMembers?.map((member) => (
            <Member
              teamId={teamId}
              userId={member.id.toString()}
              key={member.id}
              avatarUrl={member.avatar}
              name={member.name}
              email={member.email}
              role={"PENDING"}
              className="h-12 opacity-50"
              showActions={loggedInUserId ? loggedInUserId === teamOwnerId : false}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
