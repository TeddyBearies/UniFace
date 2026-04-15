import InviteCallbackHandler from "@/features/auth/InviteCallbackHandler";

export default function InviteCallbackPage({
  searchParams,
}: {
  searchParams?: {
    next?: string;
    code?: string;
    token_hash?: string;
    type?: string;
  };
}) {
  return (
    <InviteCallbackHandler
      nextPathParam={searchParams?.next}
      code={searchParams?.code}
      tokenHash={searchParams?.token_hash}
      type={searchParams?.type}
    />
  );
}
