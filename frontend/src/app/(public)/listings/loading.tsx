export default function CatalogLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="skeleton h-9 w-72" />
      <div className="skeleton mt-3 h-4 w-40" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="skeleton h-[520px] w-full" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="card overflow-hidden">
              <div className="skeleton h-52 rounded-none" />
              <div className="space-y-3 p-4">
                <div className="skeleton h-3 w-24" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
