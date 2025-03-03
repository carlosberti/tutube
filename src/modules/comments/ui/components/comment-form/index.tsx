"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { trpc } from "@/trpc/client";

type CommentFormProps = {
  videoId: string;
  parentId?: string;
  variant?: "comment" | "reply";
  onSuccess?: () => void;
  onCancel?: () => void;
};

const commentFormSchema = z.object({
  videoId: z.string().uuid(),
  parentId: z.string().uuid().nullish(),
  value: z.string().min(1),
});

type CommentFormSchema = z.infer<typeof commentFormSchema>;

export function CommentForm({
  videoId,
  parentId,
  variant = "comment",
  onSuccess,
  onCancel,
}: CommentFormProps) {
  const { user } = useUser();
  const clerk = useClerk();

  const form = useForm<CommentFormSchema>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      parentId,
      videoId,
      value: "",
    },
  });

  const utils = trpc.useUtils();
  const create = trpc.comments.create.useMutation({
    onSuccess() {
      toast.success(variant === "comment" ? "Comment added" : "Reply added");
      utils.comments.getMany.invalidate({ videoId });
      utils.comments.getMany.invalidate({ videoId, parentId });
      form.reset();

      onSuccess?.();
    },
    onError(error) {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
        return;
      }

      toast.error(error.message);
    },
  });

  const handleSubmit = async (values: CommentFormSchema) => {
    create.mutate(values);
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form
        className="group flex gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <UserAvatar
          size="lg"
          imageUrl={user?.imageUrl || "/user-placeholder.svg"}
          name={user?.username || "User"}
        />

        <div className="flex-1">
          <FormField
            name="value"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={
                      variant === "reply"
                        ? "Share your thoughts about this comment... e.g. Great comment!"
                        : "Share your thoughts about this video... e.g. Great video!"
                    }
                    className="min-h-0 resize-none overflow-hidden bg-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-2 flex justify-end gap-2">
            {onCancel && (
              <Button variant="ghost" type="button" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={create.isPending || !form.formState.isValid}
            >
              {variant === "reply" ? "Reply" : "Comment"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
