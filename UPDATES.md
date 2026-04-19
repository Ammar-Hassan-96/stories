# 📚 تحديث مكتبة القصص — 3 Features جديدة

## 🎯 اللي اتضاف

### 1️⃣ 📥 Offline Reading — القراءة بدون إنترنت
- زرار تحميل في كل قصة (ReaderTopBar)
- شاشة جديدة "قصصي المحملة" في القائمة الجانبية
- يحفظ القصة كاملة في AsyncStorage
- بيوضح حجم التخزين والعدد
- إمكانية حذف قصة واحدة أو مسح الكل

### 2️⃣ 📊 Reading Stats + Streaks — الإحصائيات والإنجازات
- **Streak النيران 🔥** — أيام قراءة متتالية (مع احتساب أطول streak)
- **4 Overall stats cards**: قصص مقروءة، دقائق قراءة، إنجازات، قصص الأسبوع
- **Activity chart** — آخر 14 يوم نشاط
- **Category breakdown** — التصنيفات الأكثر قراءة مع bars ملونة
- **10 إنجازات** مع toast احتفالي عند فتح إنجاز جديد
- **Streak banner** في الهوم بيظهر لما يكون فيه سلسلة نشطة

### 3️⃣ 🎧 Audio Narration — الاستماع للقصة
- زرار سماعات 🎧 في الـ ReaderTopBar
- Floating player بسرعات (0.75x / 1.0x / 1.25x / 1.5x)
- تقسيم تلقائي للنصوص الطويلة لـ chunks
- يستخدم `expo-speech` (TTS مجاني، شغال offline)
- دعم كامل للغة العربية (ar-SA)

---

## 🛠️ خطوات التركيب

### الخطوة 1: تثبيت الـ package الجديد

```bash
cd /path/to/stories-main
npx expo install expo-speech
```

### الخطوة 2: نسخ الملفات الجديدة

انسخ كل الملفات من فولدر `stories-upgrade` إلى مشروعك — يحافظ على نفس المسارات:

| المصدر | الوجهة |
|--------|---------|
| `App.tsx` | استبدل الملف الحالي |
| `app/types/navigation.ts` | استبدل |
| `app/services/storage.ts` | استبدل |
| `app/screens/HomeScreen.tsx` | استبدل |
| `app/screens/StoryDetailsScreen.tsx` | استبدل |
| `app/components/DrawerContent.tsx` | استبدل |
| `app/components/reader/ReaderTopBar.tsx` | استبدل |
| **ملفات جديدة:** |  |
| `app/services/offlineService.ts` | جديد |
| `app/services/statsService.ts` | جديد |
| `app/services/audioService.ts` | جديد |
| `app/hooks/useOffline.ts` | جديد |
| `app/hooks/useReadingStats.ts` | جديد |
| `app/hooks/useNarration.ts` | جديد |
| `app/screens/OfflineStoriesScreen.tsx` | جديد |
| `app/screens/StatsScreen.tsx` | جديد |
| `app/components/StreakBanner.tsx` | جديد |
| `app/components/AchievementToast.tsx` | جديد |
| `app/components/reader/AudioPlayer.tsx` | جديد |

### الخطوة 3: تجربة التطبيق

```bash
npx expo start --clear
```

---

## 📐 الـ Architecture — إزاي اتبنى

### 🗂️ Storage Keys الجديدة (في `storage.ts`)
```ts
OFFLINE_STORIES       // مصفوفة القصص المحملة
READING_STATS         // إحصائيات شاملة + history يومي (90 يوم)
READING_STREAK        // currentStreak + longestStreak + lastReadDate
READING_ACHIEVEMENTS  // IDs الإنجازات المفتوحة
AUDIO_SETTINGS        // rate + pitch + voice + language
```

### 🔄 Flow التكامل
عند اكتمال قراءة قصة (scroll >= 98%):
```
scrollHandler (worklet)
  ↓ runOnJS
handleReadingComplete()
  ├── showCompletionBadge()           [كما كان]
  ├── recordStoryCompletion(story)    [جديد]
  │   ├── updates dailyHistory (90 يوم)
  │   ├── updates totals + category breakdown
  │   └── updates streak (today-1 = +1, gap = reset)
  └── checkAchievements()             [جديد]
      └── if unlocked → show AchievementToast
```

### 🎧 Audio Chunking
`expo-speech` عنده limit في بعض الأجهزة. الحل:
- تقسيم النص لـ chunks بـ 500 حرف
- Split على حدود الجمل (`.` `!` `؟` `?`)
- تشغيل chunk وراء chunk مع callback `onDone`
- يدعم pause/resume (بيحفظ `activeChunkIndex`)

### 🔥 Streak Logic
```ts
// ملخص الـ logic
const diff = daysBetween(lastReadDate, today);
if (diff === 1)       streak += 1;     // يوم متتالي
else if (diff > 1)    streak = 1;      // فصلت السلسلة
else if (diff === 0)  // نفس اليوم - ما تغيرش
```

### 🏆 الإنجازات العشرة

| الإنجاز | الأيقونة | الشرط |
|---------|----------|-------|
| البداية | 📖 | أول قصة |
| قارئ مبتدئ | 🌱 | 5 قصص |
| قارئ نشيط | 🌟 | 25 قصة |
| مدمن قراءة | 🏅 | 50 قصة |
| عاشق الحكايات | 🏆 | 100 قصة |
| الالتزام | 🔥 | 3 أيام متتالية |
| أسبوع كامل | ⚡ | 7 أيام متتالية |
| شهر قراءة | 💎 | 30 يوم متتالي |
| ساعة قراءة | ⏱️ | 60 دقيقة |
| 5 ساعات قراءة | 📚 | 300 دقيقة |

---

## 🎨 الالتزام بـ Design System الحالي

تم الحفاظ على:
- ✅ RTL بالكامل (`flex-row-reverse`, `writingDirection: "rtl"`)
- ✅ خط Amiri في كل مكان
- ✅ نفس الألوان (`#8B5A2B` / `#C8A96E` كـ accent)
- ✅ نفس الـ dark/light theme logic
- ✅ نفس الـ animation patterns (`FadeInDown.springify()`)
- ✅ نفس الـ naming conventions و file structure
- ✅ نفس الـ SafeAreaView + Drawer integration pattern
- ✅ NativeWind + StyleSheet hybrid

---

## 🚀 Features Ready for v2

اللي ممكن تبني عليه بعد كده:
1. **Continue Reading** — حفظ scroll position لكل قصة
2. **AI Recommendations** — يحلل الـ categoryBreakdown ويقترح
3. **Share Stats** — مشاركة صورة streak على Instagram
4. **Audio Voice Selection** — اختيار الصوت من Arabic voices المتاحة
5. **Download All Bookmarks** — زرار يحمل كل المفضلة دفعة واحدة
6. **Reading Goals** — هدف أسبوعي/يومي مع progress
7. **Export Stats as PDF** — تقرير PDF شهري

---

## ⚠️ ملاحظات

### expo-speech
- شغال 100% على iOS و Android بدون API key
- كفاءة الصوت العربي بتختلف حسب الجهاز (iOS أفضل عموماً)
- على iOS بيستخدم Siri voices (جودة عالية)
- على Android بيستخدم Google TTS

### AsyncStorage Limits
- الحد الأقصى عموماً **6MB** على Android
- القصة المتوسطة = ~3KB → يعني ~2000 قصة قبل ما نوصل للحد
- Safe جداً للاستخدام العادي

### Performance
- الـ stats/streaks بتشتغل بعد اكتمال القراءة → مفيش تأثير على الـ UI
- الـ offline stories بتنقرأ من الـ cache (فوري)
- الـ audio player بيـ lazy-load بس لما المستخدم يفتحه

---

## 🐛 Debugging

لو عايز تمسح الإحصائيات أو البيانات المحلية:

```ts
import { clearStats } from "./app/services/statsService";
import { clearOfflineStories } from "./app/services/offlineService";

await clearStats();
await clearOfflineStories();
```

---

**عمار — بالتوفيق في التطبيق! 🎉**
