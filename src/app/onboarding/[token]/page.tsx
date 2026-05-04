import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

interface Props {
  params: Promise<{ token: string }>;
}

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bajablue Onboarding · Athena Studios",
  robots: { index: false, follow: false },
};

export default async function OnboardingPage({ params }: Props) {
  const { token } = await params;
  return <OnboardingWizard token={token} />;
}
