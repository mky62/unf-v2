export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 rounded-lg bg-muted" />
          <div className="mt-2 h-4 w-72 rounded-lg bg-muted" />
        </div>

        {/* Sync card skeleton */}
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-muted" />
              <div>
                <div className="h-5 w-32 rounded bg-muted" />
                <div className="mt-2 h-3 w-48 rounded bg-muted" />
              </div>
            </div>
            <div className="h-10 w-28 rounded-lg bg-muted" />
          </div>
        </div>

        {/* Profile card skeleton */}
        <div className="mt-6 rounded-2xl border bg-card overflow-hidden">
          <div className="h-24 bg-muted" />
          <div className="p-6 pt-12">
            <div className="flex justify-between">
              <div>
                <div className="h-6 w-40 rounded bg-muted" />
                <div className="mt-2 h-4 w-28 rounded bg-muted" />
              </div>
              <div className="h-10 w-28 rounded-lg bg-muted" />
            </div>
            <div className="mt-4 h-4 w-full rounded bg-muted" />
            <div className="mt-2 h-4 w-3/4 rounded bg-muted" />
          </div>
        </div>

        {/* Repos skeleton */}
        <div className="mt-6">
          <div className="mb-4 flex justify-between">
            <div className="h-6 w-36 rounded bg-muted" />
            <div className="flex gap-2">
              <div className="h-10 w-48 rounded-lg bg-muted" />
              <div className="h-10 w-36 rounded-lg bg-muted" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border bg-card p-5">
                <div className="h-5 w-36 rounded bg-muted" />
                <div className="mt-3 h-4 w-full rounded bg-muted" />
                <div className="mt-1 h-4 w-2/3 rounded bg-muted" />
                <div className="mt-3 flex gap-4">
                  <div className="h-3 w-20 rounded bg-muted" />
                  <div className="h-3 w-12 rounded bg-muted" />
                  <div className="h-3 w-12 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
