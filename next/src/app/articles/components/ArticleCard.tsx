// 記事1つ単位をカード形式で表示
type ArticleCardProps = {
  title: string
  fromToday: string
  userName: string
}

// omit関数:長いテキストを指定した文字数で切り詰めて「...」を付ける関数
const omit = (text: string) => (len: number) => (ellipsis: string) =>
  text.length >= len ? text.slice(0, len - ellipsis.length) + ellipsis : text

export default function ArticleCard({ title, userName, fromToday }: ArticleCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="p-4">
        <h3 className="mb-2 min-h-[48px] text-base font-bold leading-6">
          {omit(title)(45)('...')}
        </h3>
        <div className="flex justify-between">
          <span className="text-xs text-gray-600">{userName}</span>
          <span className="text-xs text-gray-600">{fromToday}</span>
        </div>
      </div>
    </div>
  )
}