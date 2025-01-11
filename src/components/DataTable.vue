<script setup lang="ts">
import type { DataTableResponseType } from '../types/DataTableResponseType.ts'

const props = defineProps<{
  //  data can be assumed to be always present since we check for isPending and isError
  //  this is just Vue not having as good Ts support as React ):
  data: DataTableResponseType | undefined
}>()

</script>

<template>
    <div v-for="row in props.data?.data">
      <div class="text-text-grey">{{row}}</div>
    </div>
</template>
