import { FileX, Inbox, Search, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: "inbox" | "search" | "wallet" | "file";
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

const icons = {
  inbox: Inbox,
  search: Search,
  wallet: Wallet,
  file: FileX,
};

export const EmptyState = ({
  icon = "inbox",
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  const Icon = icons[icon];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {action && action}
    </div>
  );
};
