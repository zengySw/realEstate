export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-9 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="skeleton h-28 w-full" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="skeleton h-80 w-full" />
        <div className="space-y-6">
          <div className="skeleton h-64 w-full" />
          <div className="skeleton h-48 w-full" />
        </div>
      </div>
    </div>
  );
}
