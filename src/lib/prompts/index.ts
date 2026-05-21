/**
 * Barrel module — keeps the public surface of `@/lib/prompts` intact
 * after the file was split into focused sub-modules.
 */
export { TOPIC_MAP, TOPIC_DISPLAY } from "./constants";
export { buildQuestionPrompt, buildFollowUpPrompt } from "./question";
export { buildEvaluationPrompt } from "./evaluation";
export {
  buildSessionDigestPrompt,
  buildUserModelMergePrompt,
  buildUserModelContext,
  buildMentorQuestionContext,
} from "./user-model";
