import { generateAIResponse } from "../clients/ai.client.js";
import { createPost } from "../repositories/post.repository.js";
import { findRepositoryById } from "../repositories/repository.repository.js";
import AppError from "../utils/AppError.js";
import { buildPostPrompt } from "../utils/buildPostPrompt.js";
import { generatedPostSchema } from "../validators/post.validator.js";

export const generatePost = async (repositoryId, userId) => {
  const repository = await findRepositoryById(repositoryId, userId);
  if (!repository) {
    throw new AppError("REPO NOT FOUND", 404);
  }

  const prompt = buildPostPrompt(repository);
  const response = await generateAIResponse(prompt);
  console.log("AI RESPONSE:", response);
  const cleanedResponse = response
    .replace(/^```json\s*/, "")
    .replace(/\s*```$/, "");

  const parsedResponse = JSON.parse(cleanedResponse);

  const validatePost = generatedPostSchema.parse(parsedResponse);

  // return validatePost
  const post = await createPost({
    userId,
    repositoryId,
    hook: validatePost.hook,
    content: validatePost.content,
    hashtags: validatePost.hashtags,
    cta: validatePost.cta,
  });

  return post;
};
