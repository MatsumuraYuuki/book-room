'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* サイトロゴ */}
          <div>
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
              Book Room
            </Link>
          </div>
          
          {/* 操作ボタン群 */}
          <div className="flex space-x-4">
            <Link href="/sign-in">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg font-medium transition-colors">
                Sign in
              </button>
            </Link>
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-1 rounded-lg font-medium transition-colors">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}