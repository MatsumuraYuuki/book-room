import { Navigation } from '@/components/Navigation';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="md:pl-64 flex flex-col min-h-screen pt-16">
        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>

        {/* モバイル用の下部余白 */}
        <div className="h-20 md:h-0"></div>
      </main>
    </div>

  )
}