<template>
  <div>
    <div class="grid shadow-md border bg-white p-6 grid-cols-12">
      <div class="col-span-12 mb-6">
        <div class="flex justify-between">
          <div>
            <div class="font-medium text-lg">Welcome to GoGo Libray</div>
            <div class="text-gray-500 text-sm">
              Here you can manage your books and update their status.
            </div>
          </div>
          <div class="flex gap-2">
            <div>
              <div v-if="bookList.length" class="relative mt-2 flex items-center">
                <input
                  v-model="searchText"
                  placeholder="Search books"
                  type="text"
                  name="search"
                  id="search"
                  class="block w-full px-4 rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <div class="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                  <kbd
                    class="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400"
                    >⌘K</kbd
                  >
                </div>
              </div>
            </div>
            <button
              @click="showAddBookForm = !showAddBookForm"
              class="rounded-md bg-indigo-500 text-white px-5 py-2 text-normal"
            >
              Add New
            </button>
          </div>
        </div>
      </div>
      <div v-if="!filteredBookList.length" class="col-span-12 text-center px-6">
        <div>
          <BookOpenIcon class="h-16 mx-auto w-16 text-indigo-500"></BookOpenIcon>
        </div>
        <div class="my-6">
          <div class="font-medium text-sm">Sorry, Libray is empty</div>
          <div v-if="!searchText" class="text-sm text-gray-600">
            Please help us to fill the Libray adding new books
          </div>
          <div v-else>
            We didn't find any books matching <b>{{ searchText }}</b> please search other
          </div>
        </div>
        <div>
          <button
            @click="showAddBookForm = !showAddBookForm"
            class="rounded-md bg-indigo-500 text-white px-5 py-2 text-normal"
          >
            Add New
          </button>
        </div>
      </div>
      <div v-else class="col-span-12 px-6">
        <base-table :headers="tableHeader" :data="filteredBookList" :loading="loadingIndicator">
          <template #title="{ data }">
            <div>
              {{ data?.name }}
            </div>
          </template>
          <template #author="{ data }">
            {{ data?.author }}
          </template>
          <template #status="{ data }">
            <div
              class="border flex gap-2 items-center py-2 px-3 rounded-md"
              :class="
                data?.status === 'available'
                  ? 'border-green-500 text-green-500'
                  : 'border-indigo-500 text-indigo-500'
              "
            >
              <CheckCircleIcon
                v-if="data?.status === 'available'"
                class="h-6 w-6"
              ></CheckCircleIcon>
              <ExclamationCircleIcon v-else class="h-6 w-6"></ExclamationCircleIcon>
              {{ data?.status === 'available' ? 'Available' : 'Occupied' }}
            </div>
          </template>
          <template #publisher="{ data }">
            <div>
              {{ data?.publisher }}
            </div>
          </template>
          <template #published_date="{ data }">
            <div>
              {{ data?.published_date }}
            </div>
          </template>
          <template #checkout_date="{ data }">
            <div v-if="data?.checkout_date">
              {{ data?.checkout_date }}
            </div>
            <div v-else>-</div>
          </template>
          <template #action="{ data }">
            <div class="flex gap-2 items-center">
              <button
                @click.prevent="updateBook(data)"
                class="rounded-md border text-indigo-500 flex gap-2 border-indigo-500 py-2 px-3"
                v-if="data?.status === 'available'"
              >
                <div v-if="updateLoading">Updating ....</div>
                <template v-else>
                  Checkout
                  <ArrowRightCircleIcon class="h-6 w-6"></ArrowRightCircleIcon>
                </template>
              </button>
              <button
                class="rounded-md flex gap-2 border border-green-500 text-green-500 py-2 px-3"
                @click="updateBook(data)"
                v-if="data?.status === 'checkout'"
              >
                <div v-if="updateLoading">Returning...</div>
                <template v-else>
                  Return
                  <ArrowUturnLeftIcon class="h-6 w-6"></ArrowUturnLeftIcon>
                </template>
              </button>
              <button
                @click.prevent="deleteBookConfirmation(data)"
                class="rounded-md border flex gap-2 text-red-500 border-red-500 py-2 px-3"
              >
                <ArchiveBoxXMarkIcon class="h-6 w-6"></ArchiveBoxXMarkIcon>
              </button>
            </div>
          </template>
        </base-table>
      </div>
    </div>
  </div>
  <base-dialog v-model:openDialog="deleteConfirmation">
    <div class="sm:flex sm:items-start">
      <div
        class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
      >
        <ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
      </div>
      <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
        <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900"
          >Delete Book</DialogTitle
        >
        <div class="mt-2">
          <p class="text-sm text-gray-500">
            Are you sure you want to remove this book ? You can always add new book if you have.
          </p>
        </div>
      </div>
    </div>
    <div class="mt-5 sm:ml-10 sm:mt-4 sm:flex sm:pl-4">
      <button
        type="button"
        class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto"
        @click="deleteBook"
      >
        Delete
      </button>
      <button
        type="button"
        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:ml-3 sm:mt-0 sm:w-auto"
        @click="deleteConfirmation = false"
        ref="cancelButtonRef"
      >
        Cancel
      </button>
    </div>
  </base-dialog>
  <base-dialog v-model:openDialog="showAddBookForm">
    <books-form
      v-if="showAddBookForm"
      @close="showAddBookForm = false"
      @success="afterSuccess"
    ></books-form>
  </base-dialog>
</template>

<script setup lang="ts">
import type { book } from '@/types/book'
import BaseTable from '@/components/BaseTable.vue'
import BooksForm from '@/components/Books/Form.vue'
import dayjs from 'dayjs'
import BaseDialog from '../BaseDialog.vue'
import { useBookStore } from '@/stores/libary'
import { onMounted, computed, ref, watch } from 'vue'
import {
  ArchiveBoxXMarkIcon,
  ExclamationTriangleIcon,
  ArrowRightCircleIcon,
  BookOpenIcon,
  ArrowUturnLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

// Modal variables
const showAddBookForm = ref<Boolean>(false)
const deleteConfirmation = ref<Boolean>(false)
const searchText = ref<String | null>(null)
// Define the table header

const tableHeader: { title: string; value: keyof book }[] = [
  {
    title: 'Title',
    value: 'title'
  },
  {
    title: 'Author',
    value: 'author'
  },
  {
    title: 'Publisher',
    value: 'publisher'
  },
  {
    title: 'Status',
    value: 'status'
  },
  {
    title: 'Published Date',
    value: 'published_date'
  },
  {
    title: 'Checkout/Last Updated',
    value: 'checkout_date'
  },
  {
    title: '',
    value: 'action'
  }
]

// Initialize the book list and loading indicator
const bookList = computed(() => {
  return useBookStore().bookList
})
const filteredBookList = ref(bookList.value || [])
watch(searchText, () => {
  if (searchText?.value) {
    filteredBookList.value = bookList.value.filter((book) => {
      return book?.name?.trim().toLowerCase().includes(searchText?.value?.trim().toLowerCase())
    })
  } else {
    filteredBookList.value = bookList.value
  }
})

const currentSelectedBook = ref(null)
const deleteBookConfirmation = (data) => {
  currentSelectedBook.value = data
  deleteConfirmation.value = true
}
const loadingIndicator = ref<boolean>(false)

// Define a function to fetch the book list
const fetchBookList = async () => {
  loadingIndicator.value = true
  try {
    await useBookStore().getBookList()
    filteredBookList.value = [...bookList.value]
  } finally {
    loadingIndicator.value = false
  }
}

const afterSuccess = async () => {
  showAddBookForm.value = false
  await useBookStore().getBookList()
  filteredBookList.value = useBookStore().bookList
}
const updateLoading = ref(false)
const updateBook = async (data) => {
  updateLoading.value = true
  let dataToUpdate = {
    id: data.id,
    status: data?.status === 'available' ? 'checkout' : 'available',
    checkout_date: dayjs(new Date()).format('DD MMM, YYYY')
  }
  setTimeout(async () => {
    await useBookStore().updateBook(dataToUpdate)
    filteredBookList.value = [...bookList.value]
    updateLoading.value = false
  }, 1000)
}
const deleteBook = async () => {
  await useBookStore().deleteBook(currentSelectedBook.value)
  filteredBookList.value = [...bookList.value]
  currentSelectedBook.value = null
  deleteConfirmation.value = false
}
// Fetch the book list when the component is mounted
onMounted(() => {
  fetchBookList()
})
</script>
