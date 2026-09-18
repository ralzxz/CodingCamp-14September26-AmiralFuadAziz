# Product Requirements Document (PRD)
## Expense & Budget Visualizer

---

## 1. Overview

**Product Name:** Expense & Budget Visualizer  
**Version:** 1.0  
**Target Users:** Individu yang ingin mencatat dan mengelola pengeluaran harian  
**Platform:** Web Application (Client-side)

### Problem Statement
Banyak orang kesulitan melacak pengeluaran harian mereka dan tidak menyadari kemana uang mereka pergi. Dibutuhkan tool sederhana untuk mencatat pengeluaran dan melihat visualisasi distribusi pengeluaran per kategori.

### Solution
Aplikasi web sederhana yang memungkinkan user untuk:
- Mencatat setiap transaksi dengan cepat
- Melihat total pengeluaran secara realtime
- Memvisualisasikan pengeluaran per kategori dengan pie chart
- Mengatur batas pengeluaran dengan notifikasi visual
- Mengelola kategori pengeluaran sendiri

---

## 2. User Stories

### US-01: Menambah Transaksi
**As a** user  
**I want to** menambah transaksi pengeluaran  
**So that** saya bisa mencatat setiap pengeluaran saya

**Acceptance Criteria:**
- Form input dengan field: nama item, jumlah, kategori
- Validasi semua field harus diisi
- Tombol submit untuk menambahkan
- Transaksi langsung muncul di list setelah ditambah

### US-02: Melihat Daftar Transaksi
**As a** user  
**I want to** melihat semua transaksi saya  
**So that** saya bisa review pengeluaran yang sudah tercatat

**Acceptance Criteria:**
- List menampilkan semua transaksi
- Setiap item menampilkan: nama, jumlah, kategori, tanggal
- List bisa di-scroll jika banyak data
- Tampil empty state jika belum ada transaksi

### US-03: Menghapus Transaksi
**As a** user  
**I want to** menghapus transaksi yang salah input  
**So that** data pengeluaran saya akurat

**Acceptance Criteria:**
- Setiap transaksi punya tombol hapus
- Konfirmasi sebelum hapus
- Total dan chart update otomatis setelah hapus

### US-04: Melihat Total Pengeluaran
**As a** user  
**I want to** melihat total pengeluaran saya  
**So that** saya tahu berapa banyak yang sudah saya keluarkan

**Acceptance Criteria:**
- Total ditampilkan di bagian atas
- Total update otomatis saat ada perubahan transaksi
- Format Rupiah (Rp xxx,xxx)

### US-05: Melihat Visualisasi Chart
**As a** user  
**I want to** melihat grafik distribusi pengeluaran per kategori  
**So that** saya tahu kategori mana yang paling banyak pengeluarannya

**Acceptance Criteria:**
- Pie chart menunjukkan persentase per kategori
- Warna chart sesuai warna kategori
- Tooltip menunjukkan nominal dan persentase
- Chart update otomatis saat transaksi berubah

### US-06: Mengelola Kategori
**As a** user  
**I want to** menambah, edit, dan hapus kategori sendiri  
**So that** saya bisa customize kategori sesuai kebutuhan

**Acceptance Criteria:**
- Button untuk membuka kategori management
- Form untuk add kategori baru (nama + warna)
- Edit nama kategori
- Hapus kategori dengan warning jika digunakan
- Kategori langsung tersedia di form input

### US-07: Set Spending Limit
**As a** user  
**I want to** set batas pengeluaran  
**So that** saya dapat warning jika melebihi budget

**Acceptance Criteria:**
- Input field untuk set limit
- Visual warning saat total > limit (warna merah)
- Banner alert muncul saat exceeded
- Limit tersimpan dan persisten

### US-08: Toggle Dark/Light Mode
**As a** user  
**I want to** mengganti tema tampilan  
**So that** saya bisa pilih tema yang nyaman untuk mata

**Acceptance Criteria:**
- Button toggle di header
- Switch antara light dan dark theme
- Icon berubah (🌙/☀️)
- Preference tersimpan di Local Storage

---

## 3. Functional Requirements

### FR-01: Transaction Management
- Input form dengan validasi
- Add transaction ke Local Storage
- Display transaction list (sorted by date, newest first)
- Delete transaction dengan konfirmasi
- Calculate total pengeluaran

### FR-02: Category Management
- Default categories: Food (🍔), Transport (🚗), Fun (🎮)
- CRUD operations untuk kategori
- Color picker untuk setiap kategori
- Validation: tidak boleh nama kategori duplikat

### FR-03: Data Visualization
- Chart.js pie chart
- Update realtime saat data berubah
- Legend dengan warna kategori
- Tooltip dengan detail (nominal + persentase)

### FR-04: Spending Limit
- Input untuk set limit
- Check total vs limit setiap update
- Visual indicator: red balance + warning banner
- Persist limit di Local Storage

### FR-05: Theme Management
- Light theme (default)
- Dark theme
- Toggle button
- Persist theme preference

### FR-06: Data Persistence
- Semua data di Local Storage
- Auto-load saat app start
- Data persist setelah refresh

---

## 4. Technical Requirements

### TR-01: Technology Stack
- HTML5 (semantic structure)
- CSS3 (no frameworks)
- Vanilla JavaScript (ES6+)
- Chart.js untuk visualisasi
- Local Storage API

### TR-02: File Structure
- 1 file HTML (index.html)
- 1 file CSS (css/style.css)
- 1 file JavaScript (js/app.js)

### TR-03: Browser Support
- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

### TR-04: Responsive Design
- Mobile-first approach
- Breakpoints: 320px, 768px, 1024px
- Touch-friendly buttons (min 44px)

### TR-05: Performance
- Load time < 2 detik
- Smooth animations (60fps)
- No lag saat add/delete transaksi

---

## 5. Non-Functional Requirements

### NFR-01: Usability
- Interface clean dan minimal
- Tidak ada efek neon
- Navigasi intuitif
- Clear feedback untuk setiap aksi

### NFR-02: Accessibility
- Semantic HTML
- ARIA labels untuk buttons
- Keyboard navigation support
- Readable contrast ratios

### NFR-03: Data Security
- Client-side only (no server)
- Data di Local Storage (private per browser)
- No sensitive data collection

### NFR-04: Maintainability
- Clean code structure
- Function documentation (JSDoc)
- Separation of concerns (data, UI, logic)
- Consistent naming conventions

---

## 6. Data Model

### Transaction
```javascript
{
  id: string,           // Unique ID (timestamp-based)
  name: string,         // Nama item (required)
  amount: number,       // Jumlah dalam rupiah (required)
  category: string,     // ID kategori (required)
  date: string          // ISO date string
}
```

### Category
```javascript
{
  id: string,           // Unique ID atau slug
  name: string,         // Nama kategori (required)
  icon: string,         // Emoji icon
  color: string         // Hex color code
}
```

### Storage Keys
- `expenseTracker_transactions` → Array of Transaction
- `expenseTracker_categories` → Array of Category
- `expenseTracker_spendingLimit` → Number
- `expenseTracker_theme` → String ('light' | 'dark')

---

## 7. UI/UX Requirements

### Layout
- Header: App title + theme toggle
- Balance section: Total + spending limit input
- Two-column layout (desktop): Form/List | Chart/Category
- Single-column (mobile): Stack vertical

### Color Scheme
**Light Theme:**
- Background: #f5f5f5
- Surface: #ffffff
- Primary: #2196f3
- Text: #333333

**Dark Theme:**
- Background: #1a1a1a
- Surface: #2d2d2d
- Primary: #64b5f6
- Text: #e0e0e0

### Typography
- Font: System fonts (Segoe UI, Roboto, sans-serif)
- Sizes: 16px base, 24px-32px headings

### Animations
- Fade in untuk transaction items
- Slide down untuk alerts
- Smooth theme transitions (0.3s)

---

## 8. Success Metrics

### User Metrics
- Jumlah transaksi yang ditambahkan
- Rata-rata transaksi per session
- Retention: berapa % user kembali

### Technical Metrics
- Page load time < 2s
- No console errors
- Chart render time < 100ms

### Feature Adoption
- % user yang set spending limit
- % user yang add custom category
- % user yang gunakan dark mode

---

## 9. Future Enhancements

### Phase 2 (Tidak di scope MVP)
- Export/import data (CSV/JSON)
- Filter transaksi by date range
- Search transactions
- Multiple currency support
- Budget per kategori
- Monthly/weekly summary view
- Data sync across devices

### Phase 3
- Backend integration
- User authentication
- Shared budgets (family/group)
- Recurring transactions
- Reports & analytics
- Mobile app (PWA)

---

## 10. Constraints & Assumptions

### Constraints
- No backend/server
- No database
- Client-side only
- Single browser storage

### Assumptions
- User punya browser modern
- User memahami Local Storage bisa hilang jika clear browser data
- User akan input data sendiri (no auto-import)
- User tahu kategori default (Food, Transport, Fun)

---

## 11. Risks & Mitigation

### Risk 1: Data Loss
**Risk:** User clear browser data, semua transaksi hilang  
**Mitigation:** Tampilkan warning di UI tentang Local Storage

### Risk 2: Browser Compatibility
**Risk:** Tidak jalan di browser lama  
**Mitigation:** Target modern browsers only, tampilkan warning untuk IE

### Risk 3: Performance dengan Banyak Data
**Risk:** Lag jika ada 1000+ transaksi  
**Mitigation:** Implementasi pagination atau limit tampilan

---

## 12. Release Criteria

### Definition of Done
- ✅ Semua MVP features implemented
- ✅ 3 optional features implemented
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Cross-browser tested
- ✅ Code documented
- ✅ README.md complete

### Testing Checklist
- ✅ Add transaction
- ✅ Delete transaction
- ✅ Calculate total
- ✅ Chart rendering
- ✅ Category CRUD
- ✅ Spending limit alert
- ✅ Theme toggle
- ✅ Data persistence
- ✅ Mobile responsive
- ✅ Form validation

---

**Document Version:** 1.0  
**Last Updated:** 19 September 2026  
**Author:** Amiral Fuad Aziz  
**Status:** ✅ Implemented
