import { SetupWizard } from "@/components/session/setup-wizard";

export default function NewSessionPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">New Interview</h1>
        <p className="text-white/40 text-sm mt-1">Configure your practice session</p>
      </div>
      <SetupWizard />
    </div>
  );
}
