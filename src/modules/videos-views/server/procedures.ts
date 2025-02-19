import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { videoViews } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const videoViewsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id } = input;

      const [existingVideoView] = await db
        .select()
        .from(videoViews)
        .where(and(eq(videoViews.userId, userId), eq(videoViews.videoId, id)));

      if (existingVideoView) {
        return existingVideoView;
      }

      const [createdVideoView] = await db
        .insert(videoViews)
        .values({ userId, videoId: id })
        .returning();

      return createdVideoView;
    }),
});
