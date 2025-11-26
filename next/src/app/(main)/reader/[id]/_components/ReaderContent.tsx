interface AozoraBookContent {
  title: string;
  author: string;
  content: string;
}

interface ReaderContentProps {
  bookContent: AozoraBookContent | undefined;
  fontSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark';
}

const fontSizeClasses = {
  small: "text-lg",
  medium: "text-xl",
  large: "text-2xl"
};

const themeClasses = {
  light: {
    bg: 'bg-white',
    text: 'text-gray-900'
  },
  dark: {
    bg: 'bg-gray-900',
    text: 'text-gray-200'
  }
};

export default function ReaderContent({
  bookContent,
  fontSize,
  theme,
}: ReaderContentProps) {
  return (
    <div className='max-w-full mx-auto px-4 py-4'>
      {/* ヘッダー（タイトル・著者） */}
      <div className={`mb-6 p-4 rounded-lg ${themeClasses[theme].bg}`}>
        <h1 className={`text-2xl font-bold ${themeClasses[theme].text}`}>{bookContent?.title}</h1>
        <p className={`${theme === "dark" ? 'text-gray-400' : 'text-gray-600'}`}>{bookContent?.author}</p>
      </div>

      {/* 本文エリア */}
      <div className={`shadow-md rounded-lg p-8 ${themeClasses[theme].bg}`}>
        <div
          className={`prose max-w-none ${fontSizeClasses[fontSize]} ${themeClasses[theme].text}`}
          dangerouslySetInnerHTML={{
            __html: bookContent?.content || ""
          }}
        >
        </div>
      </div>
    </div>
  );
}
