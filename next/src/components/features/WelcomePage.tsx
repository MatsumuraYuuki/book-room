import { useRouter } from 'next/navigation';
import Image from 'next/image';


export function WelcomePage() {
  const router = useRouter();

  return (
    <div className="py-16 md:py-24 bg-white">
      {/* ヒーローセクション */}
      <section className=" py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">

            {/* 左側：テキスト */}
            <div className="flex-1 text-center md:text-left">
              <h1 className='text-5xl font-bold text-gray-900 mb-4'>
                <span className='text-blue-500'>青空文庫</span>の純文学を、<br />
                もっと読みやすく
              </h1>
              <p className='text-lg text-gray-600 mb-2'>
                15,000作品の中からお気に入りを見つけて、あなただけの本棚で管理しよう
              </p>
              <button
                onClick={() => router.push("/auth/sign-in")}
                className='bg-green-500 rounded-lg px-8 py-3 text-sm font-semibold'
              >
                無料でお試し
              </button>
            </div>

            {/* 右側：イラスト */}
            <div className="flex-1 w-full max-w-lg">
              <Image
                src={"/undraw_reading-time_gcvc.svg"}
                alt='本を読んでいる人のイラスト'
                width={500}
                height={500}
                className="w-full h-auto"
              />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}