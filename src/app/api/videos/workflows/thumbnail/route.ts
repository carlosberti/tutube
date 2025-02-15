import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
import { UTApi, UTFile } from "uploadthing/server";

import { db } from "@/db";
import { videos } from "@/db/schema";
import { env } from "@/env";

type InputType = {
  userId: string;
  videoId: string;
  prompt: string;
};

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { userId, videoId, prompt } = input;
  const utapi = new UTApi();

  const [video] = await context.run(
    "get-video",
    async () =>
      await db
        .select()
        .from(videos)
        .where(and(eq(videos.userId, userId), eq(videos.id, videoId)))
  );

  const generatedThumbnail = await context.run(
    "generate-thumbnail",
    async () => {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("output_format", "jpeg");
      formData.append("model", "sd3-medium");
      formData.append("aspect_ratio", "16:9");

      const response = await fetch(
        "https://api.stability.ai/v2beta/stable-image/generate/sd3",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.STABILITY_API_KEY}`,
            Accept: "image/*",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to generate image: ${response.status} ${await response.text()}`
        );
      }

      const arrayBuffer = await response.arrayBuffer();

      return Buffer.from(arrayBuffer).toString("base64");
    }
  );

  await context.run("cleanup-thumbnail", async () => {
    if (video.thumbnailKey) {
      await utapi.deleteFiles(video.thumbnailKey);
      await db
        .update(videos)
        .set({ thumbnailKey: null, thumbnailUrl: null })
        .where(and(eq(videos.userId, userId), eq(videos.id, videoId)));
    }
  });

  const uploadThumbnail = await context.run("upload-thumbnail", async () => {
    const base64Image = Buffer.from(generatedThumbnail, "base64");
    const file = new UTFile([base64Image], `thumbnail-${videoId}.jpg`, {
      lastModified: Date.now(),
      type: "image/jpeg",
    });

    const { data } = await utapi.uploadFiles(file);

    if (!data) {
      throw new Error("Failed to upload thumbnail");
    }

    return data;
  });

  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({
        thumbnailKey: uploadThumbnail.key,
        thumbnailUrl: uploadThumbnail.ufsUrl,
      })
      .where(and(eq(videos.userId, userId), eq(videos.id, videoId)));
  });
});
