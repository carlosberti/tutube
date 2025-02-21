import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";

import { trpc } from "@/trpc/client";

type UseSubscriptionProps = {
  userId: string;
  isSubscribed: boolean;
  fromVideoId?: string;
};

export function useSubscription({
  userId,
  isSubscribed,
  fromVideoId,
}: UseSubscriptionProps) {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const subscribe = trpc.subscriptions.create.useMutation({
    onSuccess() {
      toast.success("Subscribed");
      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError(error) {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      } else {
        toast.error(error.message);
      }
    },
  });

  const unsubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess() {
      toast.success("Unsubscribed");
      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError(error) {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      } else {
        toast.error(error.message);
      }
    },
  });

  const isPending = subscribe.isPending || unsubscribe.isPending;

  const onClick = () => {
    if (isSubscribed) {
      unsubscribe.mutate({ userId });
    } else {
      subscribe.mutate({ userId });
    }
  };

  return {
    isPending,
    onClick,
  };
}
