// File: check-models.js
// Thay 'AIzaSy...' bằng API Key thật của bạn vào bên dưới:
const API_KEY = "AIzaSyC9oSYQviCR6SK11GwsjMHnbWnn-r9H1fM"; 

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  
  try {
    console.log("Dang ket noi den Google...");
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("❌ Lỗi API:", data.error.message);
      return;
    }

    console.log("\n✅ DANH SÁCH MODEL KHẢ DỤNG CHO KEY CỦA BẠN:");
    console.log("------------------------------------------------");
    
    // Lọc ra các model hỗ trợ generateContent (Chat)
    const chatModels = data.models.filter(m => 
      m.supportedGenerationMethods.includes("generateContent")
    );

    chatModels.forEach(model => {
      console.log(`🔹 Tên: ${model.name}`); // Đây chính là cái tên bạn cần copy vào code
      console.log(`   Mô tả: ${model.displayName}`);
      console.log("------------------------------------------------");
    });

  } catch (error) {
    console.error("Lỗi kết nối:", error);
  }
}

listModels();