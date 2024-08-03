<!--
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
-->
<template>
  <form>
    <div class="space-y-12">
      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="text-base font-semibold leading-7 text-gray-900">Book Information</h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">
          Please fill all the information to add new book.
        </p>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-3">
            <label for="book-name" class="block text-sm font-medium leading-6 text-gray-900"
              >Book name</label
            >
            <div class="mt-2">
              <input
                type="text"
                v-model="formValue.name"
                name="book-name"
                id="book-name"
                autocomplete="given-name"
                class="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div v-if="errorMessage?.name" class="text-red-500 text-xs mx-2 my-1">
              {{ errorMessage.name }}
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="author-name" class="block text-sm font-medium leading-6 text-gray-900"
              >Author</label
            >
            <div class="mt-2">
              <input
                v-model="formValue.author"
                type="text"
                name="author-name"
                id="author-name"
                autocomplete="author-name"
                class="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div v-if="errorMessage?.author" class="text-red-500 text-xs mx-2 my-1">
              {{ errorMessage.author }}
            </div>
          </div>

          <div class="sm:col-span-4">
            <label for="publisher" class="block text-sm font-medium leading-6 text-gray-900"
              >Publisher</label
            >
            <div class="mt-2">
              <input
                v-model="formValue.publisher"
                id="publisher"
                name="publisher"
                type="publisher"
                autocomplete="name"
                class="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div v-if="errorMessage?.publisher" class="text-red-500 text-xs mx-2 my-1">
              {{ errorMessage.publisher }}
            </div>
          </div>

          <div class="sm:col-span-3">
            <label for="date" class="block text-sm font-medium leading-6 text-gray-900"
              >Published Date</label
            >
            <div class="mt-2">
              <input
                v-model="formValue.published_date"
                type="date"
                id="date"
                name="date"
                autocomplete="date"
                class="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
            <div v-if="errorMessage?.published_date" class="text-red-500 text-xs mx-2 my-1">
              {{ errorMessage.published_date }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button
        @click="$emit('close')"
        type="button"
        class="text-sm font-semibold leading-6 text-gray-900"
      >
        Cancel
      </button>
      <button
        @click.prevent="addNewBook"
        class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Save
      </button>
    </div>
  </form>
</template>

<script setup>
import { useBookStore } from '@/stores/libary'
import { PhotoIcon, UserCircleIcon } from '@heroicons/vue/24/solid'
import { reactive } from 'vue'
const formValue = reactive({
  name: '',
  author: '',
  publisher: '',
  published_date: '',
  status: 'available'
})
const errorMessage = reactive({
  name: '',
  author: '',
  publisher: '',
  published_date: ''
})
const emits = defineEmits(['success'])
const validateData = () => {
  errorMessage.name = !formValue.name.trim() ? 'Book name is required' : null
  errorMessage.author = !formValue.author.trim() ? 'Author name is required' : null
  errorMessage.publisher = !formValue.publisher.trim() ? 'Publisher name is required' : null
  errorMessage.published_date = !formValue.published_date.trim()
    ? 'Published Date is required'
    : null

  return Object.values(errorMessage).every((value) => value === null)
}
const addNewBook = async () => {
  if (await validateData()) {
    useBookStore().addNewBook(formValue)
    emits('success')
  }
}
</script>
