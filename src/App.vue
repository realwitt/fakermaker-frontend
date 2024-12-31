<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import './index.css'
</script>

<template>
  <header>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
  </header>

  <RouterView />
</template>

