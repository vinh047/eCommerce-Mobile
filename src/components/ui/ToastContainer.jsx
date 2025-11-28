// 'use client'

// import { useEffect } from 'react'
// import { useToast } from '@/hooks/useToast'

// export default function ToastContainer() {
//   const { toasts, removeToast } = useToast()

//   const getToastIcon = (type) => {
//     switch (type) {
//       case 'success': return 'fas fa-check-circle'
//       case 'error': return 'fas fa-exclamation-circle'
//       case 'warning': return 'fas fa-exclamation-triangle'
//       default: return 'fas fa-info-circle'
//     }
//   }

//   const getToastColor = (type) => {
//     switch (type) {
//       case 'success': return 'bg-green-500'
//       case 'error': return 'bg-red-500'
//       case 'warning': return 'bg-yellow-500'
//       default: return 'bg-blue-500'
//     }
//   }

//   return (
//     <div className="fixed top-4 right-4 z-50 space-y-2">
//       {toasts.map(toast => (
//         <div
//           key={toast.id}
//           className={`
//             px-4 py-3 rounded-lg shadow-lg text-white max-w-sm
//             transform transition-all duration-300 ease-in-out
//             animate-slide-in-right
//             ${getToastColor(toast.type)}
//           `}
//         >
//           <div className="flex items-center space-x-2">
//             <i className={getToastIcon(toast.type)}></i>
//             <span>{toast.message}</span>
//             <button
//               onClick={() => removeToast(toast.id)}
//               className="ml-auto text-white hover:text-gray-200"
//             >
//               <i className="fas fa-times text-sm"></i>
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }