import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useGetNotifications } from "@/lib/services/queries";
import { timeAgo } from "@/lib/timestamp-to-relative";
import { useMarkAsRead, useReplyInvite } from "@/lib/services/mutations";
import { BaseNotification } from "./base-notification";
import { Check, CheckCheck, X } from "lucide-react";

type InboxViewProps = {
  className?: string;
};

export const NotificationView = ({ className }: InboxViewProps) => {
  const notifications = useGetNotifications().data;
  const markAsRead = useMarkAsRead();
  const replyInvite = useReplyInvite();
  const [maxWidth, setMaxColumnWidth] = useState(0);

  const timeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (timeRefs.current.length) {
      const maxWidth = Math.max(...timeRefs.current.map((ref) => ref?.offsetWidth || 0));
      setMaxColumnWidth(maxWidth);
    }
  }, [notifications]);

  return (
    <div className={cn("flex flex-col w-full h-full px-5", className)}>
      <h1 className="text-3xl font-bold font-mono mb-5">Inbox</h1>
      <Headers timeColumnWidth={maxWidth} />
      <div>
        {notifications?.map((item, index) => {
          if (item.type.toUpperCase() === "BASIC") {
            return (
              <BaseNotification
                key={item.id}
                item={{
                  id: item.id.toString(),
                  content: item.content,
                  time: timeAgo(item.createdAt),
                  unread: !item.isRead,
                }}
                timeRef={(el) => (timeRefs.current[index] = el)}
                minTimeWidth={maxWidth}
                actions={[
                  {
                    name: "Mark as read",
                    icon: CheckCheck,
                    func: () => markAsRead.mutate({ id: item.id.toString() }),
                  },
                ]}
              />
            );
          } else if (item.type.toUpperCase() === "INVITE") {
            return (
              <BaseNotification
                key={item.id}
                item={{
                  id: item.id.toString(),
                  content: item.content,
                  time: timeAgo(item.createdAt),
                  unread: !item.isRead,
                }}
                timeRef={(el) => (timeRefs.current[index] = el)}
                minTimeWidth={maxWidth}
                actions={[
                  {
                    name: "Accept",
                    icon: Check,
                    func: async () => {
                      await replyInvite.mutateAsync({
                        inviteId: item.inviteId!.toString(),
                        accept: true,
                      });
                      markAsRead.mutate({ id: item.id.toString() });
                    },
                  },
                  {
                    name: "Reject",
                    icon: X,
                    func: async () => {
                      await replyInvite.mutateAsync({
                        inviteId: item.inviteId!.toString(),
                        accept: false,
                      });
                      markAsRead.mutate({ id: item.id.toString() });
                    },
                  },
                ]}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

function Headers({ timeColumnWidth }: { timeColumnWidth: number }) {
  return (
    <div className="flex gap-2 w-full border-b border-gray-300 font-mono font-semibold">
      <div className="w-8" />
      <div className="flex-1">Content</div>
      <div className="border-l border-gray-300 h-6" />
      <div className="min-w-32" style={{ minWidth: `${timeColumnWidth}px` }}>
        Time
      </div>
      <div className="border-l border-gray-300 h-6" />
      <div className="min-w-32">Actions</div>
    </div>
  );
}
