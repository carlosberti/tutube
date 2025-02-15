import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

import { db } from "@/db";
import { videos, videoUpdateSchema } from "@/db/schema";
import { env } from "@/env";
import { mux } from "@/lib/mux";
import { workflow } from "@/lib/workflow";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const videosRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policy: ["public"],
        input: [
          {
            generated_subtitles: [
              {
                language_code: "en",
                name: "English",
              },
            ],
          },
        ],
      },
      cors_origin: "*", //TODO: In production, set this to the domain of the app
    });

    const [video] = await db
      .insert(videos)
      .values({
        userId,
        title: "Untitled Video",
        muxStatus: "waiting",
        muxUploadId: upload.id,
      })
      .returning();

    return {
      video,
      url: upload.url,
    };
  }),
  update: protectedProcedure
    .input(videoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id, title, description, categoryId, visibility } = input;

      if (!id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [updatedVideo] = await db
        .update(videos)
        .set({
          title,
          description,
          categoryId,
          visibility,
          updatedAt: new Date(),
        })
        .where(and(eq(videos.userId, userId), eq(videos.id, id)))
        .returning();

      if (!updatedVideo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return updatedVideo;
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id } = input;

      const [removedVideo] = await db
        .delete(videos)
        .where(and(eq(videos.userId, userId), eq(videos.id, id)))
        .returning();

      if (!removedVideo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return removedVideo;
    }),
  restoreThumbnail: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.userId, userId), eq(videos.id, input.id)));

      if (!existingVideo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (existingVideo.thumbnailKey) {
        const utapi = new UTApi();

        await utapi.deleteFiles(existingVideo.thumbnailKey);
        await db
          .update(videos)
          .set({ thumbnailUrl: null, thumbnailKey: null })
          .where(and(eq(videos.userId, userId), eq(videos.id, input.id)));
      }

      const playbackId = existingVideo.muxPlaybackId;

      if (!playbackId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;

      const [updatedVideo] = await db
        .update(videos)
        .set({ thumbnailUrl })
        .where(and(eq(videos.userId, userId), eq(videos.id, input.id)))
        .returning();

      if (!updatedVideo) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return updatedVideo;
    }),
  generateThumbnail: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { workflowRunId } = await workflow.trigger({
        url: `${env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
        body: {
          userId,
          videoId: input.id,
        },
        retries: 3,
      });

      return { workflowRunId };
    }),
  generateTitle: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { workflowRunId } = await workflow.trigger({
        url: `${env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
        body: {
          userId,
          videoId: input.id,
        },
        retries: 3,
      });

      return { workflowRunId };
    }),
  generateDescription: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { workflowRunId } = await workflow.trigger({
        url: `${env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/description`,
        body: {
          userId,
          videoId: input.id,
        },
        retries: 3,
      });

      return { workflowRunId };
    }),
});
