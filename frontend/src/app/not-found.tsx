import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="text-6xl">🏡</span>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
        Сторінку не знайдено
      </h1>
      <p className="mt-2 text-sm text-slate-500">Страница не найдена · Page not found</p>
      <Link href="/" className="btn-primary mt-7">
        На головну →
      </Link>
    </div>
  );
}
