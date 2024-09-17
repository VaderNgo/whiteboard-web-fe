import { Hint } from "@/components/hint";
import { cn } from "@/lib/utils";
import { Tooltip } from "@radix-ui/react-tooltip";
import { CheckCheck, LucideIcon } from "lucide-react";

export type BaseNotificationProps = {
  id: string;
  content: string;
  time: string;
  unread: boolean;
};

export type BaseNotificationAction = {
  name: string;
  icon: LucideIcon;
  func: () => void;
};

export function BaseNotification({
  item,
  timeRef,
  minTimeWidth,
  actions,
}: {
  item: BaseNotificationProps;
  timeRef: (el: HTMLDivElement | null) => void;
  minTimeWidth: number;
  actions: BaseNotificationAction[];
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 w-full border-b border-gray-200 font-mono relative",
        !item.unread && "opacity-50"
      )}
    >
      <div className="w-8 flex justify-center items-center">
        {item.unread ? (
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0" />
          </div>
        ) : (
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
          </div>
        )}
      </div>
      <div className="flex-1 py-2 overflow-hidden text-ellipsis whitespace-nowrap">
        {item.content}
      </div>
      <div className="border-l border-gray-300 h-6" />
      <div className="min-w-32 py-2" ref={timeRef} style={{ minWidth: `${minTimeWidth}px` }}>
        {item.time}
      </div>
      <div className="border-l border-gray-300 h-6" />
      <div className="min-w-32 flex gap-2 py-2">
        {actions.map((action, index) => {
          return (
            <Hint key={index} side="top" align="center" label={action.name}>
              <button
                key={action.name}
                className={cn(
                  "p-1 rounded",
                  item.unread && "hover:bg-gray-100",
                  !item.unread && "pointer-events-none"
                )}
                onClick={action.func}
                disabled={!item.unread}
              >
                <action.icon className="h-4 w-4" />
              </button>
            </Hint>
          );
        })}
      </div>
    </div>
  );
}
