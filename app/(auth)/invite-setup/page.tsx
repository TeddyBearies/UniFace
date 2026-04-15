import InviteSetupForm from "@/features/auth/InviteSetupForm";

export default function InviteSetupPage({
  searchParams,
}: {
  searchParams?: {
    error?: string;
  };
}) {
  return <InviteSetupForm errorMessage={searchParams?.error || ""} />;
}
