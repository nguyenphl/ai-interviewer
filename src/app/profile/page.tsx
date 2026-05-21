import { getOrCreateUserModel, deserializeUserModel } from "@/lib/user-model";
import Link from "next/link";
import { PlayCircle, Sparkles } from "lucide-react";
import { ProfileHeader } from "@/components/profile/profile-header";
import { OverallAssessmentCard } from "@/components/profile/overall-assessment-card";
import { RecommendedFocusCard } from "@/components/profile/recommended-focus-card";
import { KnowledgeGapsCard } from "@/components/profile/knowledge-gaps-card";
import { RecurringMistakesCard } from "@/components/profile/recurring-mistakes-card";
import { StrengthsCard } from "@/components/profile/strengths-card";
import { FrameworkGapsCard } from "@/components/profile/framework-gaps-card";
import { AnswerStyleCard } from "@/components/profile/answer-style-card";

export default async function ProfilePage() {
  const raw = await getOrCreateUserModel();
  const model = deserializeUserModel(raw);

  if (model.sessionCount === 0) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center px-6 py-20">
        <div className="text-center max-w-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <Sparkles className="h-6 w-6 text-white/30" />
          </div>
          <h1 className="text-xl font-bold text-white">No profile yet</h1>
          <p className="mt-2 text-sm text-white/40 leading-relaxed">
            Complete at least one interview session to build your learning profile. The AI will track your strengths, weaknesses, and recurring mistakes over time.
          </p>
          <Link
            href="/sessions/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:opacity-90 transition-opacity"
          >
            <PlayCircle className="h-4 w-4" /> Start Your First Interview
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <ProfileHeader sessionCount={model.sessionCount} assessment={model.overallAssessment} />

      <div className="px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <OverallAssessmentCard assessment={model.overallAssessment} />
          <RecommendedFocusCard items={model.recommendedFocus} />
          <KnowledgeGapsCard gaps={model.knowledgeGaps} />
          <RecurringMistakesCard mistakes={model.recurringMistakes} />
          <StrengthsCard strengths={model.strengths} />
          <FrameworkGapsCard gaps={model.frameworkGaps} />
          <AnswerStyleCard answerStyle={model.answerStyle} communicationPatterns={model.communicationPatterns} />
        </div>
      </div>
    </div>
  );
}
