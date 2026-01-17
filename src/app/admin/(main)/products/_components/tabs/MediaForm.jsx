// "use client";

// import { useState } from "react";
// import { useFormContext, useFieldArray } from "react-hook-form";
// import { UploadCloud, X, Image as ImageIcon, Star } from "lucide-react";

// export default function MediaForm() {
//   const { control, register, watch } = useFormContext();
//   const { fields, append, remove, update } = useFieldArray({
//     control,
//     name: "images", // Mảng ảnh
//   });

//   const [isDragging, setIsDragging] = useState(false);

//   // Xử lý kéo thả file (Demo UI)
//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     // Logic xử lý file thực tế sẽ ở đây (gọi API upload -> lấy URL -> append URL)
//     // Demo: thêm ảnh placeholder
//     append({ url: "https://via.placeholder.com/300", isPrimary: fields.length === 0 });
//   };

//   // Xử lý input file change
//   const handleFileChange = (e) => {
//      // Tương tự, logic upload file thật sẽ ở đây
//      if(e.target.files.length > 0) {
//         // Giả lập upload xong
//         append({ url: URL.createObjectURL(e.target.files[0]), isPrimary: fields.length === 0 });
//      }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Drag & Drop Zone */}
//       <div 
//         className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer bg-gray-50
//             ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
//         `}
//         onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
//         onDragLeave={() => setIsDragging(false)}
//         onDrop={handleDrop}
//         onClick={() => document.getElementById('file-upload').click()}
//       >
//         <input 
//             id="file-upload" 
//             type="file" 
//             multiple 
//             className="hidden" 
//             accept="image/*"
//             onChange={handleFileChange}
//         />
//         <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
//             <UploadCloud className="w-8 h-8" />
//         </div>
//         <h3 className="text-lg font-semibold text-gray-900">Tải ảnh sản phẩm</h3>
//         <p className="text-gray-500 mt-1 text-sm">Kéo thả hoặc nhấn để chọn ảnh (JPG, PNG, WEBP)</p>
//       </div>

//       {/* Image Grid Preview */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {fields.map((field, index) => (
//             <div key={field.id} className="relative group aspect-square bg-gray-100 rounded-lg border overflow-hidden">
//                 {/* Ảnh */}
//                 <img src={field.url} alt="Product" className="w-full h-full object-cover" />
                
//                 {/* Overlay Actions */}
//                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
//                     <div className="flex justify-end">
//                         <button 
//                             type="button" 
//                             onClick={() => remove(index)}
//                             className="p-1.5 bg-white/90 text-red-600 rounded-md hover:bg-white"
//                         >
//                             <X className="w-4 h-4" />
//                         </button>
//                     </div>
                    
//                     {/* Nút đặt làm ảnh đại diện */}
//                     <button
//                         type="button"
//                         onClick={() => {
//                             // Reset tất cả primary về false
//                             fields.forEach((_, i) => update(i, { ...fields[i], isPrimary: false }));
//                             // Set cái hiện tại là true
//                             update(index, { ...field, isPrimary: true });
//                         }}
//                         className={`w-full py-1.5 text-xs font-medium rounded flex items-center justify-center gap-1 
//                             ${field.isPrimary ? "bg-blue-600 text-white" : "bg-white/90 text-gray-700 hover:bg-white"}
//                         `}
//                     >
//                         <Star className={`w-3 h-3 ${field.isPrimary ? "fill-white" : ""}`} />
//                         {field.isPrimary ? "Ảnh đại diện" : "Đặt làm đại diện"}
//                     </button>
//                 </div>
                
//                 {/* Input ẩn để react-hook-form ghi nhận data */}
//                 <input type="hidden" {...register(`images.${index}.url`)} />
//                 <input type="hidden" {...register(`images.${index}.isPrimary`)} />
//             </div>
//         ))}
//       </div>
//     </div>
//   );
// }