<script setup lang="ts">
import MakerSelector from './MakerSelector.vue'
import { ref, watch } from 'vue'
import { getCurrentInstance } from 'vue'
import MakerConfig from './MakerConfig.vue'
import { QueryClient, useMutation, VueQueryPlugin } from '@tanstack/vue-query'
import type { MakerConfigType } from '../types/MakerConfigType.ts'
import type { DataTableRequestType } from '../types/DataTableRequestType.ts'
import type { DataTableResponseType } from '../types/DataTableResponseType.ts'
import DataTable from './DataTable.vue'
import FakerSelector from './FakerSelector.vue'

const makers = [
  'First Name',
  'Last Name',
  'Company Name',
  'Email',
  'Phone Number',
  'Address',
  'Address 2',
  'State',
  'City',
  'Zip',
  'Price',
  'Number',
  'Date',
  'True/False',
  'Id',
  'Credit Card',
  'Credit Card CVV'
]

const activeMakers = ref<string[]>([])
const makerConfigs = ref<MakerConfigType[]>([])

watch(activeMakers, (newMakers, oldMakers) => {
  // Find newly added makers
  const addedMakers = newMakers.filter(maker => !oldMakers.includes(maker))

  // For each new maker, create its config
  addedMakers.forEach(maker => {
    const baseConfig: MakerConfigType = {
      makerEnum: maker.replace(/\s*\(\d+\)\s*$/, ''),
      nickname: maker,
      nullable: false
    }

    // Add specific configurations based on maker type
    switch (maker) {
      case 'Date':
        baseConfig.dateRange = [
          'JAN-01-1970',
          'FEB-04-2006'
        ]
        break

      case 'Id':
        baseConfig.idTypeEnum = 'UUID'
        break

      case 'Number':
        baseConfig.numberRange = [
          '1',
          '2'
        ]
        break

      case 'Price':
        baseConfig.numberRange = [
          '1',
          '2'
        ]
        break
    }

    makerConfigs.value.push(baseConfig)
  })

  // Remove configs for removed makers
  const removedMakers = oldMakers.filter(maker => !newMakers.includes(maker))
  removedMakers.forEach(maker => {
    const index = makerConfigs.value.findIndex(config => config.makerEnum === maker)
    if (index !== -1) {
      makerConfigs.value.splice(index, 1)
    }
  })
}, { deep: true })

const handleMakerDelete = (makerEnum: string) => {
  // Remove from activeMakers
  const index = activeMakers.value.findIndex(maker =>
    maker.replace(/\s*\(\d+\)\s*$/, '') === makerEnum
  )
  if (index !== -1) {
    activeMakers.value.splice(index, 1)
  }

  // Remove from makerConfigs
  const configIndex = makerConfigs.value.findIndex(config =>
    config.makerEnum === makerEnum
  )
  if (configIndex !== -1) {
    makerConfigs.value.splice(configIndex, 1)
  }

  // Update schema immediately
  schema.value = {
    ...schema.value,
    makers: makerConfigs.value
  }
}


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000 // 5 minutes
    }
  }
})

const app = getCurrentInstance()
if (app?.appContext.app) {
  app.appContext.app.use(VueQueryPlugin, {
    queryClient
  })
}

const schema = ref<DataTableRequestType>({
  makers: [],
  fakers: []
})
const updateFakers = (selectedFakers: string[]) => {
  schema.value = {
    ...schema.value,
    fakers: selectedFakers
  }
}

const dataTableItemsQuery = useMutation<DataTableResponseType, Error, DataTableRequestType>({
  mutationFn: async (requestSchema) => {
    const response = await fetch('https://data.fakermaker.fm/api/fakermaker/dataTable/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestSchema)
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    return response.json()
  }
})

function handleGenerateData() {
  schema.value = {
    ...schema.value,
    makers: makerConfigs.value
    // Keep existing fakers from schema.value.fakers
  }

  // Submit the schema
  dataTableItemsQuery.mutate(schema.value)}


const isAnimating = ref(false)
const triggerAnimation = () => {
  if (!isAnimating.value) {
    isAnimating.value = true
    setTimeout(() => {
      isAnimating.value = false
    }, 1500) // Match this to your animation duration
  }
}
</script>

<template>
  <div class="flex h-full">
    <FakerSelector @update:fakers="updateFakers" />

    <div class="ml-16 mr-8 flex-1">

      <!-- Changed to group to enable hover targeting -->
      <div class="relative" @mouseenter="triggerAnimation">
        <h1 class="text-text-grey text-[40px] font-black mt-10">
          fakermaker
        </h1>
<!--todo: fix animation-->
<!--        &lt;!&ndash; Mirrored flash &ndash;&gt;-->
<!--        <h1 class="absolute -top-[11px] left-0 text-[40px] font-black mt-10-->
<!--      text-transparent bg-clip-text bg-gradient-to-r from-transparent via-accent-pink to-transparent-->
<!--      bg-[length:200%_100%] opacity-0 select-none transform -scale-y-100"-->
<!--            :class="{ 'animate-shine': isAnimating }"-->
<!--        >-->
<!--          fakermaker-->
<!--        </h1>-->
      </div>

      <h2 class="text-text-grey mt-3.5 max-w-[510px] leading-[22px] mb-12">
        Quickly generate fake test data using characters
        from your favorite movies, shows, video games, and more.
      </h2>

      <MakerSelector :item-names="makers" v-model="activeMakers" />

      <div class="flex flex-wrap gap-10 mt-10">
        <div v-for="(makerConfig, i) in makerConfigs" :key="i">
          <MakerConfig
            :makerConfig="makerConfig"
            @delete="handleMakerDelete"
          />
        </div>
      </div>


      <button
        class="my-20 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none"
        :class="{
        'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white': !dataTableItemsQuery.isPending.value,
        'bg-blue-300 cursor-not-allowed text-white': dataTableItemsQuery.isPending.value
      }"
        @click="handleGenerateData"
        :disabled="dataTableItemsQuery.isPending.value"
      >
        {{ dataTableItemsQuery.isPending.value ? 'Generating...' : 'Generate Data' }}
      </button>
    </div>

  </div>

  <!--  this floats above the context as a tooltip after the API call has completed. -->
    <div
      v-if="!dataTableItemsQuery.isPending.value && !dataTableItemsQuery.isError.value && dataTableItemsQuery.data.value">
      <DataTable :data="dataTableItemsQuery.data.value" />
    </div>


</template>
