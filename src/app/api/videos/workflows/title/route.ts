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

const TITLE_SYSTEM_PROMPT = `Your task is to generate an SEO-focused title for a video based on its transcript. Please follow these guidelines:
- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long and no more than 100 characters.
- ONLY return the title as plain text. Do not add quotes or any additional formatting.

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

  const generatedTitle = await context.run("get-title", async () => {
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite-preview-02-05",
    });

    const prompt = `${TITLE_SYSTEM_PROMPT} ${transcript}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  });

  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({ title: generatedTitle || video.title })
      .where(and(eq(videos.userId, userId), eq(videos.id, videoId)));
  });
});
