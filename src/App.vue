<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Layout/Header.vue'
import Footer from './components/Layout/Footer.vue'
</script>

<template>
  <div class="grid grid-cols-12">
    <div class="col-span-12">
      <Header />
    </div>
    <div class="col-span-12 container md:ms-32 my-16">
      <RouterView />
    </div>
    <div class="col-span-12">
      <Footer />
    </div>
  </div>
</template>
