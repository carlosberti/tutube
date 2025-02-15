import { GoogleGenerativeAI } from "@google/generative-ai";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { videos } from "@/db/schema";
import { env } from "@/env";

type InputType = {
  userId: string;
  videoId: string;
};

const DESCRIPTION_SYSTEM_PROMPT = `Your task is to summarize the transcript of a video. Please follow these guidelines:
- Be brief. Condense the content into a summary that captures the key points and main ideas without losing important details.
- Avoid jargon or overly complex language unless necessary for the context.
- Focus on the most critical information, ignoring filler, repetitive statements, or irrelevant tangents.
- ONLY return the summary, no other text, annotations, or comments.
- Aim for a summary that is 3-5 sentences long and no more than 200 characters.

The transcript is:`;

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { userId, videoId } = input;

  const [video] = await context.run(
    "get-video",
    async () =>
      await db
        .select()
        .from(videos)
        .where(and(eq(videos.userId, userId), eq(videos.id, videoId)))
  );

  const transcript = await context.run("get-transcript", async () => {
    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    const text = response.text();

    if (!text) {
      throw new Error("Bad request");
    }

    return text;
  });

  const generatedDescription = await context.run(
    "generate-description",
    async () => {
      const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-lite-preview-02-05",
      });

      const prompt = `${DESCRIPTION_SYSTEM_PROMPT} ${transcript}`;

      const result = await model.generateContent(prompt);
      return result.response.text();
    }
  );

  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({ description: generatedDescription || video.description })
      .where(and(eq(videos.userId, userId), eq(videos.id, videoId)));
  });
});
