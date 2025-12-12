import { useRouter } from 'next/navigation';
import Image from 'next/image';


export function WelcomePage() {
  const router = useRouter();

  return (
    <div className="py-8 md:py-12">
      {/* ヒーローセクション */}
      <section className=" py-8 md:py-12">
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
                className='bg-green-500 rounded-lg mt-6 px-8 py-3 text-sm font-semibold'
              >
                無料でお試し
              </button>
            </div>

            {/* 右側：イラスト */}
            <div className="flex-1 w-full max-w-lg">
              <Image
                src={"/images/undraw_reading-time_gcvc.svg"}
                alt='本を読んでいる人のイラスト'
                width={500}
                height={500}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>

        </div>
      </section>

      {/* 機能紹介セクション1: 豊富な作品検索 */}
      <section className='pt-8 md:pt-12'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row gap-8 md:gap-12'>

            {/* 左側：機能紹介セクション1 */}
            <div className='flex-1'>
              <div className="text-center">
                <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                  豊富な作品検索
                </h2>
                <p className='h-20 md:h-16 text-lg text-gray-600 mb-6'>
                  青空文庫の15,000作品以上から、作品名・著者名で簡単に検索。<br/>
                  あなたの読みたい純文学がきっと見つかります。
                </p>
                <div className='flex gap-4 justify-center'>
                  <Image
                    src={"/images/search-mockup.png"}
                    alt='検索画面'
                    width={500}
                    height={500}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* 右側：機能紹介セクション2 */}
            <div className='flex-1'>
              <div className="text-center">
                <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                  快適な読書環境
                </h2>
                <p className='h-20 md:h-16 text-lg text-gray-600 mb-6'>
                  文字サイズ・背景色をカスタマイズ可能。<br/>
                  長時間の読書も快適に楽しめます。
                </p>
                <div className='flex gap-4 justify-center'>
                  <Image
                    src={"/images/reader-mockup.png"}
                    alt='本棚画面'
                    width={500}
                    height={500}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}