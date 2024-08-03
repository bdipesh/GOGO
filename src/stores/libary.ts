import { ref } from 'vue'
import { defineStore } from 'pinia'
import StorageApi from '@/utils/localstorage'

interface Book {
  id: number
  status: string
  // Add other book properties here
}

interface BookStore {
  bookList: Ref<Book[]>
  getBookList: () => Promise<void>
  addNewBook: (payload: Book) => void
  updateBook: (payload: { id: number; status: string; checkout_date: string }) => void
  deleteBook: (payload: { id: number }) => void
}

export const useBookStore = defineStore('bookStore', (): BookStore => {
  const bookList: Ref<Book[]> = ref([])

  const getBookList = async (): Promise<void> => {
    try {
      const response = await StorageApi.getItem('bookList')
      if (response?.length) {
        bookList.value = response
      }
    } catch (error) {
      console.error('Error fetching book list:', error)
    }
  }

  const addNewBook = (payload: Book): void => {
    const dataToPost = { ...payload, id: Math.random() }
    StorageApi.setItem('bookList', [dataToPost, ...bookList.value])
    bookList.value = [dataToPost, ...bookList.value]
  }

  const updateBook = (payload: { id: number; status: string }): void => {
    const currentBookList = bookList.value
    const updatedBookList = currentBookList.map((book) => {
      if (book.id === payload.id) {
        return { ...book, status: payload.status, checkout_date: payload.checkout_date }
      }
      return book
    })
    bookList.value = updatedBookList
    StorageApi.setItem('bookList', updatedBookList)
  }

  const deleteBook = (payload: { id: number }): void => {
    const currentBookList = bookList.value
    const updatedBookList = currentBookList.filter((book) => book.id !== payload.id)
    bookList.value = updatedBookList
    StorageApi.setItem('bookList', updatedBookList)
  }

  return { bookList, getBookList, addNewBook, updateBook, deleteBook }
})
