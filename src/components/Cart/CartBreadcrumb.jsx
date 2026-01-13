import { ROUTES } from '@/config/routes'
import Link from 'next/link'

export default function CartBreadcrumb() {
  return (
    <nav className="bg-white border-b border-gray-200" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href={ROUTES.HOME} className="text-gray-500 hover:text-gray-700 focus-ring rounded">Trang chủ</Link>
          </li>
          <li>
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
            </svg>
          </li>
          <li>
            <span className="text-gray-900 font-medium" aria-current="page">Giỏ hàng</span>
          </li>
        </ol>
      </div>
    </nav>
  )
}