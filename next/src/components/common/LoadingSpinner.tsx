interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function LoadingSpinner({
  message = "読み込み中...",  //  「= "読み込み中..."」はデフォルト値
  size = "medium"
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-blue-500 mb-4`}></div>
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  )
}




