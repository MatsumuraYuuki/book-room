import { BsSun, BsMoonStars } from 'react-icons/bs';

interface ReaderControlsProps {
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  onBack: () => void;
}

export default function ReaderControls({
  fontSize,
  setFontSize,
  theme,
  setTheme,
  onBack,
}: ReaderControlsProps) {
  return (
    <div className={`sticky top-0 z-10 shadow-md ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-full mx-auto px-4 py-4">
        <div className='flex justify-between items-center'>
          {/* コントロールパネル */}
          <div className='flex gap-4 items-center'>
            {/* フォントサイズ変更 */}
            <div className='flex gap-2'>
              <button
                onClick={() => setFontSize('small')}
                className={`px-3 py-1 rounded ${fontSize === "small" ? "bg-blue-500 text-white" : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                小
              </button>

              <button
                onClick={() => setFontSize('medium')}
                className={`px-3 py-1 rounded ${fontSize === "medium" ? "bg-blue-500 text-white" : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                中
              </button>

              <button
                onClick={() => setFontSize('large')}
                className={`px-3 py-1 rounded ${fontSize === "large" ? "bg-blue-500 text-white" : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                大
              </button>
            </div>

            {/* カラー変更（トグルスイッチ） */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200 ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              aria-label="テーマ切り替え"
            >
              {/* スライダー（アイコン入り） */}
              <span
                className={`inline-flex items-center justify-center h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-200 ${theme === 'dark' ? 'translate-x-9' : 'translate-x-1'
                  }`}
              >
                {theme === 'light' ? (
                  <BsSun className="w-3.5 h-3.5 text-yellow-500" />
                ) : (
                  <BsMoonStars className="w-3.5 h-3.5 text-blue-600" />
                )}
              </span>
            </button>
          </div>

          {/* 戻るボタン */}
          <button
            className='px-3 py-2 bg-gray-500 font-semibold text-white rounded hover:bg-gray-600'
            onClick={onBack}
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  );
}
