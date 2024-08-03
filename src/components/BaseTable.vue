<template>
  <div class="">
    <!-- <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
             <h1 class="text-base font-semibold leading-6 text-gray-900">
                Users
             </h1>
             <p class="mt-2 text-sm text-gray-700">
                A list of all the users in your account including their name,
                title, email and role.
             </p>
          </div>
          <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
             <button
                type="button"
                class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
             >
                Add user
             </button>
          </div>
       </div> -->
    <div class="flow-root mb-4">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6">
        <div class="inline-block min-w-full py-2 align-middle lg:px-0 sm:px-6">
          <div class="overflow-hidden ring-black ring-opacity-5 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-white">
                <tr>
                  <th
                    v-for="(header, index) in headers"
                    :key="index"
                    scope="col"
                    class="pl-4 md:py-6 pr-3 text-left bg-indigo-50 text-lg py-3 sm:text-sm font-medium sm:pl-6"
                  >
                    {{ header.title }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="data in data" :key="data.id">
                  <td
                    v-for="(header, index) in headers"
                    :key="index"
                    :class="data?.status !== 'available' ? 'bg-gray-50' : ''"
                    class="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6"
                  >
                    <slot :name="header.value" :data="data"></slot>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <nav
      v-if="totalCount > 10"
      class="flex items-center justify-between bg-white px-0 pb-3 sm:px-0 border-gray-100 border-opacity-55"
      aria-label="Pagination"
    >
      <div class="hidden sm:block">
        <p class="text-sm text-gray-700">
          Showing
          {{ ' ' }}
          <span class="font-medium">{{ start }}</span>
          {{ ' ' }}
          to
          {{ ' ' }}
          <span class="font-medium">{{ end }}</span>
          {{ ' ' }}
          of
          {{ ' ' }}
          <span class="font-medium">{{ totalCount }}</span>
          {{ ' ' }}
          results
        </p>
      </div>
      <div class="flex flex-1 justify-between sm:justify-end">
        <button
          @click="prevPage"
          :disabled="page === 1"
          :class="
            page === 1 ? 'cursor-not-allowed border-gray-700 text-gray-700' : 'cursor-pointer'
          "
          class="border border-gray-900 px-3 py-2 rounded-xl flex gap-2 text-gray-1000 mx-2"
        >
          <ArrowLeftIcon class="h-6 w-6"></ArrowLeftIcon>
          <span class="font-normal"> Prev </span>
        </button>
        <button
          @click="nextPage"
          :disabled="remainingDataCount < 10"
          :class="
            remainingDataCount < 10
              ? 'cursor-not-allowed border-gray-700 text-gray-700'
              : 'cursor-pointer'
          "
          class="border border-gray-900 px-3 py-2 rounded-xl flex gap-2 text-gray-1000 mx-2"
        >
          <span class="font-normal"> Next </span>
          <ArrowRightIcon class="h-6 w-6"></ArrowRightIcon>
        </button>
      </div>
    </nav>
  </div>
</template>

<script>
import {
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'
export default {
  components: {
    CalendarIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    ClockIcon,
    ArrowTopRightOnSquareIcon,
    CheckCircleIcon
  },
  props: {
    search: {
      type: String,
      default: ''
    },
    headers: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    totalCount: {
      type: [String, Number],
      default: 0
    },
    currentPage: {
      type: Number,
      default: 1
    },
    remainingDataCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      page: 1,
      perPage: 10,
      offset: 1
    }
  },
  watch: {
    currentPage() {
      this.page = this.currentPage
      this.offset = this.currentPage - 1 * this.perPage
    }
  },
  computed: {
    start() {
      return (this.page - 1) * this.perPage + 1
    },
    end() {
      return Math.min(this.page * this.perPage, this.totalCount)
    },
    currentData() {}
  },
  created() {
    this.page = this.currentPage || 1
    this.offset = this.page - 1 * this.perPage
  },
  methods: {
    nextPage() {
      this.$emit('next-page')
    },
    prevPage() {
      this.$emit('prev-page')
    }
  }
}
</script>
