import api from './axios'

export const borrowApi = {
  getAll(params) {
    return api.get('/api/circulation/borrows', { params })
  },

  getById(id) {
    return api.get(`/api/circulation/borrows/${id}`)
  },

  getMyBorrows(params) {
    return api.get('/api/circulation/borrows/me', { params })
  },

  getStats() {
    return api.get('/api/circulation/borrows/stats')
  },

  getByBook(bookId) {
    return api.get(`/api/circulation/borrows/book/${bookId}`)
  },

  getByReader(readerId) {
    return api.get(`/api/circulation/borrows/reader/${readerId}`)
  },

  getOverdue(params) {
    return api.get('/api/circulation/borrows/overdue', { params })
  },

  getFines(params) {
    return api.get('/api/circulation/borrows/fines', { params })
  },

  getReaderFines(readerId) {
    return api.get(`/api/circulation/borrows/reader/${readerId}/fines`)
  },

  // Librarian/Admin tạo phiếu mượn trực tiếp - cần đủ readerId + bookId + dueDate.
  create(data) {
    return api.post('/api/circulation/borrows', data)
  },

  // Reader TỰ đăng ký mượn - endpoint riêng, không cần readerId (BE tự lấy từ token).
  // Body: { bookId, requestedDays } (requestedDays mặc định 14 nếu bỏ trống).
  requestBorrow(data) {
    return api.post('/api/circulation/borrows/request', data)
  },

  // Duyệt yêu cầu mượn - body { dueDate } tùy chọn (null = dùng mặc định +14 ngày).
  approve(id, dueDate = null) {
    return api.put(`/api/circulation/borrows/${id}/approve`, { dueDate })
  },

  // Từ chối yêu cầu mượn - không cần body.
  reject(id) {
    return api.put(`/api/circulation/borrows/${id}/reject`)
  },

  // Trả sách - data: { returnDate } (returnDate có thể null = lấy thời gian hiện tại).
  returnBook(id, data) {
    return api.put(`/api/circulation/borrows/${id}/return`, data)
  },

  // Trả về sẵn { qrImageUrl, fineAmount, readerName, bookTitle, ... } - FE chỉ cần hiển thị.
  getFinePaymentQr(id) {
    return api.get(`/api/circulation/borrows/${id}/payment-qr`)
  },

  // Xác nhận đã thu phạt - không cần body.
  payFine(id) {
    return api.put(`/api/circulation/borrows/${id}/pay-fine`)
  },

  // Batch mượn từ giỏ (Tích hợp thêm)
  createFromCart(data) {
    return api.post('/api/circulation/borrows/batch', data, { timeout: 60000 })
  },

  // Đặt chỗ sách (Tích hợp thêm)
  reserve(data) {
    return api.post('/api/circulation/borrows/reserve', data)
  },

  getMyReservations() {
    return api.get('/api/circulation/borrows/reservations/me')
  },

  cancelReservation(reservationId) {
    return api.delete(`/api/circulation/borrows/reservations/${reservationId}`)
  },

  getSettings() {
    return api.get('/api/circulation/borrow-settings')
  },

  updateSettings(data) {
    return api.put('/api/circulation/borrow-settings', data)
  }
}

export const borrowSettingsApi = {
  get() {
    return api.get('/api/circulation/borrow-settings')
  },
  update(data) {
    return api.put('/api/circulation/borrow-settings', data)
  }
}

export const invoiceApi = {
  getAll(params) {
    return api.get('/api/circulation/invoices', { params })
  },

  getById(id) {
    return api.get(`/api/circulation/invoices/${id}`)
  },

  getMyInvoices() {
    return api.get('/api/circulation/invoices/me')
  },

  getByReader(readerId) {
    return api.get(`/api/circulation/invoices/reader/${readerId}`)
  },

  getByBorrow(borrowRecordId) {
    return api.get(`/api/circulation/invoices/borrow/${borrowRecordId}`)
  }
}

export const proxyApi = {
  searchBooks(params) {
    return api.get('/api/circulation/proxy/books', { params })
  },

  searchReaders(params) {
    return api.get('/api/circulation/proxy/readers', { params })
  }
}