"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CopyCheckIcon,
  CopyIcon,
  Globe2Icon,
  ImagePlusIcon,
  Loader2Icon,
  LockIcon,
  MoreVerticalIcon,
  RotateCcwIcon,
  SparklesIcon,
  TrashIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AsyncBoundary } from "@/components/async-boundary";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { videoInsertSchema } from "@/db/schema";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";
import { trpc } from "@/trpc/client";

import { ThumbnailUploadModal } from "../components/thumbnail-upload-modal";

type FormSectionProps = {
  videoId: string;
};

function FormSectionSuspense({ videoId }: FormSectionProps) {
  const router = useRouter();
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const [thumbnailOpen, setThumbnailOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const utils = trpc.useUtils();

  const update = trpc.videos.update.useMutation({
    onSuccess() {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Video updated");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const remove = trpc.videos.remove.useMutation({
    onSuccess() {
      utils.studio.getMany.invalidate();
      toast.success("Video removed");
      router.push("/studio");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
    onSuccess() {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Thumbnail restored");
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
    onSuccess() {
      toast.success("Background job started", {
        description: "Generating thumbnail...",
      });
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const generateTitle = trpc.videos.generateTitle.useMutation({
    onSuccess() {
      toast.success("Background job started", {
        description: "Generating title...",
      });
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const generateDescription = trpc.videos.generateDescription.useMutation({
    onSuccess() {
      toast.success("Background job started", {
        description: "Generating description...",
      });
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const form = useForm<z.infer<typeof videoInsertSchema>>({
    defaultValues: video,
    resolver: zodResolver(videoInsertSchema),
  });

  const onSubmit = (data: z.infer<typeof videoInsertSchema>) => {
    update.mutateAsync(data);
  };

  // eslint-disable-next-line no-restricted-syntax
  const fullUrl = `${process.env.VERCEL_URL || "http://localhost:3000"}/videos/${videoId}`;

  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);

    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Video details</h1>
              <p className="text-xs text-muted-foreground">
                Manage your video details
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={update.isPending}>
                Save
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => remove.mutate({ id: videoId })}
                  >
                    <TrashIcon className="mr-2 size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="space-y-8 lg:col-span-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-x-2">
                        Title
                        <Button
                          size="icon"
                          variant="outline"
                          type="button"
                          className="size-6 rounded-full [&_svg]:size-3"
                          onClick={() => generateTitle.mutate({ id: videoId })}
                          disabled={
                            generateTitle.isPending || !video.muxTrackId
                          }
                        >
                          {generateTitle.isPending ? (
                            <Loader2Icon className="animate-spin" />
                          ) : (
                            <SparklesIcon />
                          )}
                        </Button>
                      </div>
                    </FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Add a title to your video"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-x-2">
                      Description
                      <Button
                        size="icon"
                        variant="outline"
                        type="button"
                        className="size-6 rounded-full [&_svg]:size-3"
                        onClick={() =>
                          generateDescription.mutate({ id: videoId })
                        }
                        disabled={
                          generateDescription.isPending || !video.muxTrackId
                        }
                      >
                        {generateDescription.isPending ? (
                          <Loader2Icon className="animate-spin" />
                        ) : (
                          <SparklesIcon />
                        )}
                      </Button>
                    </div>

                    <FormControl>
                      <Textarea
                        {...field}
                        className="resize-none pr-10"
                        value={field.value ?? ""}
                        rows={10}
                        placeholder="Add a description to your video"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>

                    <FormControl>
                      <div className="group relative h-[84px] w-[153px] border border-dashed border-neutral-400 p-0.5">
                        <Image
                          src={video.thumbnailUrl || THUMBNAIL_FALLBACK}
                          fill
                          alt="Thumbnail"
                          className="object-cover"
                        />

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              size="icon"
                              className="absolute right-1 top-1 size-7 rounded-full bg-black/50 opacity-100 duration-300 hover:bg-black/70 group-hover:opacity-100 md:opacity-0"
                            >
                              <MoreVerticalIcon className="text-white" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="start" side="right">
                            <DropdownMenuItem
                              onClick={() => setThumbnailOpen(true)}
                            >
                              <ImagePlusIcon className="mr-1" />
                              Change
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                generateThumbnail.mutate({ id: videoId })
                              }
                            >
                              <SparklesIcon className="mr-1" />
                              AI-generated
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                restoreThumbnail.mutate({ id: videoId })
                              }
                              disabled={!video.thumbnailKey}
                            >
                              <RotateCcwIcon className="mr-1" />
                              Restore
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-8 lg:col-span-2">
              <div className="flex h-fit flex-col gap-4 overflow-hidden rounded-xl bg-[#F9F9F9]">
                <div className="relative aspect-video overflow-hidden">
                  <VideoPlayer
                    playbackId={video.muxPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                  />
                </div>

                <div className="flex flex-col gap-y-6 p-4">
                  <div className="flex items-center justify-between gap-x-2">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-xs text-muted-foreground">
                        Video link
                      </p>

                      <div className="flex items-center gap-x-2">
                        <Link
                          href={`/videos/${video.id}`}
                          className="text-xs text-primary underline"
                        >
                          <p className="line-clamp-1 text-sm text-blue-500">
                            {fullUrl}
                          </p>
                        </Link>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={onCopy}
                          disabled={isCopied}
                        >
                          {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-xs text-muted-foreground">
                        Video status
                      </p>
                      <p className="text-sm">
                        {snakeCaseToTitleCase(video.muxStatus || "preparing")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-xs text-muted-foreground">
                        Subtitle status
                      </p>
                      <p className="text-sm">
                        {snakeCaseToTitleCase(
                          video.muxTrackStatus || "no_subtitles"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a visibility" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Globe2Icon className="size-4" />
                            Public
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <LockIcon className="size-4" />
                            Private
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>

      <ThumbnailUploadModal
        videoId={videoId}
        open={thumbnailOpen}
        onOpenChange={setThumbnailOpen}
      />
    </>
  );
}

function FormSectionSkeleton() {
  return <div className="flex flex-col gap-4">Loading...</div>;
}

export function FormSection({ videoId }: FormSectionProps) {
  return (
    <AsyncBoundary
      loadingFallback={<FormSectionSkeleton />}
      errorFallback={
        <div role="alert" aria-live="polite">
          Failed to load video
        </div>
      }
    >
      <FormSectionSuspense videoId={videoId} />
    </AsyncBoundary>
  );
}
