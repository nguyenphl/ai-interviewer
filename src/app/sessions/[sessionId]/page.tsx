import { notFound } from "next/navigation";
import prisma from "@/lib/db/prisma";
import { InterviewClient } from "@/components/session/interview-client";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      questions: {
        orderBy: { orderIndex: "asc" },
        include: { answers: { orderBy: { submittedAt: "asc" } } },
      },
    },
  });
  if (!session) notFound();
  if (session.status === "completed") {
    const { redirect } = await import("next/navigation");
    redirect(`/sessions/${sessionId}/review`);
  }

  return <InterviewClient session={JSON.parse(JSON.stringify(session))} />;
}
