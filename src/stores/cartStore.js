import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const CART_KEY = 'borrowCart'
const RESERVATIONS_KEY = 'borrowReservations'
const MAX_CART = 5

function loadFromStorage(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') || [] } catch { return [] }
}

export const useCartStore = defineStore('borrowCart', () => {
  const items = ref(loadFromStorage(CART_KEY))
  const reservations = ref(loadFromStorage(RESERVATIONS_KEY))

  const count = computed(() => items.value.length)

  function isInCart(bookId) {
    return items.value.some(b => b.id === bookId)
  }

  function getReservation(bookId) {
    return reservations.value.find(r => r.bookId === bookId) ?? null
  }

  function canAdd(myActiveBorrowCount) {
    return items.value.length < MAX_CART && (myActiveBorrowCount + items.value.length) < MAX_CART
  }

  // Returns true if added, false if already in cart or limit reached
  function addBook(book, myActiveBorrowCount = 0) {
    if (isInCart(book.id)) return false
    if (!canAdd(myActiveBorrowCount)) return false
    items.value.push({
      id: book.id,
      title: book.title,
      author: book.author,
      coverImageUrl: book.coverImageUrl ?? null,
      availableCopies: book.availableCopies
    })
    _persist()
    return true
  }

  function removeBook(bookId) {
    items.value = items.value.filter(b => b.id !== bookId)
    _persist()
  }

  function clearCart() {
    items.value = []
    _persist()
  }

  function addReservation({ bookId, reservationId, bookTitle, position }) {
    reservations.value = reservations.value.filter(r => r.bookId !== bookId)
    reservations.value.push({ bookId, reservationId, bookTitle, position, reservedAt: new Date().toISOString() })
    _persistReservations()
  }

  function removeReservation(bookId) {
    reservations.value = reservations.value.filter(r => r.bookId !== bookId)
    _persistReservations()
  }

  function _persist() {
    localStorage.setItem(CART_KEY, JSON.stringify(items.value))
  }

  function _persistReservations() {
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations.value))
  }

  return {
    items,
    reservations,
    count,
    isInCart,
    getReservation,
    canAdd,
    addBook,
    removeBook,
    clearCart,
    addReservation,
    removeReservation
  }
})
