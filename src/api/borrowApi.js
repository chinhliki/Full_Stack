import api from './axios'

export const borrowApi = {
  getAll(params) {
    return api.get('/api/circulation/borrows', { params })
  },

  getMyBorrows(params) {
    return api.get('/api/circulation/borrows/me', { params })
  },

  create(data) {
    return api.post('/api/circulation/borrows', data, { timeout: 60000 })
  },

  returnBook(id, data) {
    return api.put(`/api/circulation/borrows/${id}/return`, data)
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

  payFine(id) {
    return api.put(`/api/circulation/borrows/${id}/pay-fine`)
  },

  // Batch borrow from cart — POST /api/circulation/borrows/batch
  // body: { readerId, borrowDate, books: [{ bookId, dueDate }] }
  createFromCart(data) {
    return api.post('/api/circulation/borrows/batch', data, { timeout: 60000 })
  },

  // Reserve a book — POST /api/circulation/borrows/reserve
  // body: { readerId, bookId }
  // response: { reservationId, position, estimatedWaitDays }
  reserve(data) {
    return api.post('/api/circulation/borrows/reserve', data)
  },

  getMyReservations() {
    return api.get('/api/circulation/borrows/reservations/me')
  },

  cancelReservation(reservationId) {
    return api.delete(`/api/circulation/borrows/reservations/${reservationId}`)
  }
}