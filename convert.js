const fs = require("fs");

// اقرأ الملف الأصلي
const rawData = fs.readFileSync("stories_rows (1).json", "utf-8");
const data = JSON.parse(rawData);

// لو الداتا جاية كـ array مباشر أو جوا object
const storiesArray = Array.isArray(data) ? data : data.stories || [];

// دالة تجيب description من أول سطر/100 حرف
function getDescription(content) {
  if (!content) return "";
  return content.replace(/\n/g, " ").substring(0, 120) + "...";
}

// تحويل البيانات
const transformed = {
  stories: storiesArray.map((item) => ({
    id: String(item.id),
    title: item.title || "",
    description: getDescription(item.content),
    content: item.content || "",
    categoryId: item.category_id || "",
    image: item.image_url || "",
    author: item.author || "",
    date: item.created_at ? item.created_at.split(" ")[0] : "",
  })),
};

// حفظ الملف الجديد
fs.writeFileSync(
  "stories.json",
  JSON.stringify(transformed, null, 2),
  "utf-8"
);

console.log("✅ تم تحويل الملف بنجاح");