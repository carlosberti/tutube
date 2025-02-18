import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SubscriptionButtonProps = Pick<
  ButtonProps,
  "onClick" | "disabled" | "size"
> & {
  isSubscribed: boolean;
  className?: string;
};

export function SubscriptionButton({
  onClick,
  disabled,
  isSubscribed,
  className,
  size,
}: SubscriptionButtonProps) {
  return (
    <Button
      variant={isSubscribed ? "secondary" : "default"}
      className={cn("rounded-full", className)}
      onClick={onClick}
      disabled={disabled}
      size={size}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
}
