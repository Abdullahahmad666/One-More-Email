import { Loader } from "@/components/loader";

/**
 * Route-level loading UI. The marketing page is static so this rarely shows,
 * but it's the boundary Next.js reaches for during navigation, and it's where
 * the app's async screens will land later.
 */
export default function Loading() {
  return (
    <div className="loader-gate flex min-h-[60vh] flex-1 items-center justify-center px-6 py-24">
      <Loader size="lg" label="One moment" />
    </div>
  );
}
