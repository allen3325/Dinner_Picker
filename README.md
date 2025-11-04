# 晚餐選擇器 (Dinner Picker) 🍽️

一個幫助用戶快速決定晚餐去處的網頁應用。透過定位用戶位置，抓取附近餐廳資訊，並隨機推薦餐廳選項。

## 功能特點

- 📍 **自動定位**：取得用戶當前位置（需授權）
- 🔍 **智能搜尋**：使用 Google Maps API 搜尋附近 1.5 公里內的餐廳
- 🎲 **隨機推薦**：可設定推薦餐廳數量（1-10 間），隨機抽選
- 🃏 **卡片展示**：精美的餐廳卡片顯示詳細資訊
  - 店家照片（從 Google Places 獲取）
  - 評分與評論數
  - 地址與距離
  - 營業狀態
  - 價格等級
- 🗺️ **地圖整合**：點擊卡片直接在 Google Maps 查看

## 技術棧

- **前端框架**: React 18
- **建置工具**: Vite
- **地圖服務**: Google Maps API (Places API, Maps JavaScript API)
- **定位服務**: Geolocation API

## 開始使用

### 前置需求

- Node.js 18+ 和 npm
- Google Maps API 金鑰（需啟用 Maps JavaScript API 和 Places API）

### 安裝步驟

1. **複製專案**
   ```bash
   git clone <repository-url>
   cd Dinner_Picker
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **設定 Google Maps API 金鑰**

   a. 前往 [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)

   b. 建立或選擇一個專案

   c. 啟用以下 API：
      - Maps JavaScript API
      - Places API

   d. 建立 API 金鑰（建議設定 HTTP referrer 限制以提高安全性）

   e. 複製 `.env.example` 為 `.env` 並填入 API 金鑰：
   ```bash
   cp .env.example .env
   ```

   f. 編輯 `.env` 檔案：
   ```env
   VITE_GOOGLE_MAPS_API_KEY=你的API金鑰
   ```

4. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

5. **開啟瀏覽器**

   訪問 `http://localhost:5173`（或終端顯示的網址）

### 建置生產版本

```bash
npm run build
npm run preview
```

## 使用指南

1. 開啟應用後，瀏覽器會請求定位權限，請點擊「允許」
2. 應用會自動搜尋附近 1.5 公里內的餐廳
3. 在輸入框設定想要推薦的餐廳數量（1-10 間，預設 3 間）
4. 點擊「顯示餐廳」按鈕，查看隨機推薦的餐廳
5. 點擊任一餐廳卡片，可在 Google Maps 查看詳細資訊
6. 想要重新推薦？再次點擊「重新推薦」按鈕即可

## 專案結構

```
Dinner_Picker/
├── src/
│   ├── components/
│   │   ├── RestaurantCard.jsx      # 餐廳卡片元件
│   │   └── RestaurantCard.css      # 餐廳卡片樣式
│   ├── App.jsx                      # 主應用元件
│   ├── App.css                      # 主應用樣式
│   ├── main.jsx                     # React 進入點
│   └── index.css                    # 全域樣式
├── index.html                       # HTML 模板
├── vite.config.js                   # Vite 配置
├── package.json                     # 專案依賴
├── .env.example                     # 環境變數範例
└── README.md                        # 專案說明
```

## 技術考量

### 錯誤處理
- 定位失敗時顯示友善錯誤訊息
- API 呼叫失敗時的備案方案
- 無餐廳結果時的提示

### 效能優化
- 使用 Places API 緩存搜尋結果
- 減少不必要的 API 呼叫
- 圖片載入錯誤時顯示預設圖片

### 無障礙設計
- 按鈕與輸入框支援鍵盤操作
- 適當的 ARIA 標籤
- 良好的色彩對比度

### 響應式設計
- 支援深色模式
- 手機、平板、桌面裝置自適應

## API 使用限制

Google Maps API 有免費額度限制：
- Places API：每月 $200 USD 免費額度
- Maps JavaScript API：每月 $200 USD 免費額度

請參考 [Google Maps Platform 定價](https://mapsplatform.google.com/pricing/) 了解詳情。

## 授權

MIT License

## 貢獻

歡迎提交 Issue 和 Pull Request！