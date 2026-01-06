# Testing Guide - Add Card Feature

## Langkah Testing

### 1. Buka Developer Console
- Tekan `F12` atau `Ctrl+Shift+I`
- Pilih tab "Console"

### 2. Test Menambahkan Card
1. Klik tombol "+" di salah satu kolom
2. Isi form:
   - **Title**: (required) - misal "Test Task"
   - **Description**: (optional) - misal "Testing description"
   - **Due Date**: (optional) - pilih tanggal
   - **Labels**: (optional) - misal "design, testing"
3. Klik "Add Card"

### 3. Cek Console Logs
Anda harus melihat log berikut (dengan emoji):
```
🔵 handleSubmit called with: {columnId: "...", form: {...}}
� KanbanBoard onAddCard called: {columnId: "...", cardData: {...}}
🔵 addCard called with: {columnId: "...", cardData: {...}}
📅 Formatted due date: {input: "2026-01-07", output: "2026-01-07T00:00:00.000Z"}
📦 Final payload: {title: "...", notes: "...", due: "..."}
📤 Creating task with payload: {taskListId: "...", task: {...}}
✅ Created task successfully: {id: "...", title: "...", ...}
✅ Card added to board state
✅ Form submitted successfully
```

### 4. Expected Result
- ✅ Dialog tertutup otomatis
- ✅ Card baru muncul di kolom
- ✅ Card bisa di-drag
- ✅ Card tersinkron dengan Google Tasks

## Troubleshooting

### Error: "API_ERROR 400"
**Masalah umum:**
- Format due date tidak valid → Cek log "📅 Formatted due date"
- Title kosong atau karakter invalid
- Notes terlalu panjang (max 8192 chars)

**Cara debug:**
1. Cek console log "📦 Final payload" - lihat data yang dikirim
2. Buka Network tab → cari request ke `tasks.googleapis.com`
3. Klik request → tab "Response" untuk detail error
4. Coba tambah task tanpa due date dulu
5. Coba dengan title sederhana (tanpa emoji/special chars)

### Error: "Google token tidak ditemukan"
- **Solusi**: Login ulang dengan Google

### Error: "Unauthorized - token expired"
- **Solusi**: Logout dan login kembali

### Error: "API_ERROR 400/403/500"
- **Solusi**: Cek koneksi internet dan permissions Google Tasks API

### Card tidak muncul setelah add
- **Cek**: Console logs untuk error
- **Cek**: Network tab untuk request API
- **Cek**: Google Tasks app/website untuk memverifikasi data tersimpan

## Manual Testing Checklist

- [ ] Add card dengan title only
- [ ] Add card dengan semua fields
- [ ] Add card dengan labels (comma separated)
- [ ] Add card dengan due date
- [ ] Add card dengan description panjang
- [ ] Card baru muncul di UI
- [ ] Card baru bisa di-drag
- [ ] Card tersinkron di Google Tasks
- [ ] Dialog tertutup setelah submit
- [ ] Form ter-reset setelah submit
- [ ] Multiple cards bisa ditambahkan berturut-turut

## API Integration Test

Buka Network tab di DevTools dan cek:
1. Request ke `https://tasks.googleapis.com/tasks/v1/lists/{listId}/tasks`
2. Method: `POST`
3. Response status: `200 OK`
4. Response body berisi task yang baru dibuat
