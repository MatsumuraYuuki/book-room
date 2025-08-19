// src/app/page.tsx
export default function HomePage() {
  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="container mx-auto max-w-4xl pt-6 px-4">
        <h1 className="text-3xl font-bold text-center">Welcome to Reading App</h1>
        <p className="text-center mt-4">
          <a href="/articles" className="text-blue-600 hover:text-blue-800">
            記事一覧を見る
          </a>
        </p>
      </div>
    </div>
  );
}