<script setup lang="ts">
import InputSelector from './InputSelector.vue'
import { provide, ref, watch } from 'vue'
import { getCurrentInstance } from 'vue'
import MakerConfig from './MakerConfig.vue'
import { QueryClient, useMutation, useQuery, useQueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import type { MakerConfigType } from '../types/MakerConfigType.ts'
import type { DataTableRequestType } from '../types/DataTableRequestType.ts'
import type { DataTableResponseType } from '../types/DataTableResponseType.ts'

const makers = [
  "First Name",
  "Last Name",
  "Company Name",
  "Email",
  "Phone Number",
  "Address",
  "Address 2",
  "State",
  "City",
  "Zip",
  "Price",
  "Number",
  "Date",
  "True/False",
  "Id",
  "Credit Card",
  "Credit Card CVV"
];

const activeMakers = ref<string[]>([])
const makerConfigs = ref<MakerConfigType[]>([])

watch(activeMakers, (newMakers, oldMakers) => {
  // Find newly added makers
  const addedMakers = newMakers.filter(maker => !oldMakers.includes(maker))
  console.log('new makers are:')
  console.log(addedMakers)

  // For each new maker, create its config
  addedMakers.forEach(maker => {
    const baseConfig: MakerConfigType = {
      // todo: check if there's a better way to do this than casting to our type
      makerEnum: maker.replace(/\s*\(\d+\)\s*$/, ''), // as MakerEnum,  // Strips numbers in parentheses at the end,
      nickname: maker, // need to be unique so deletion works
      nullable: false,
    }

    // Add specific configurations based on maker type
    switch (maker) {
      case 'Date':
        baseConfig.dateRange = [
          "JAN-01-1970",
          "FEB-04-2006"
        ]
        break

      // todo: add options for this
      // case 'Credit Card':
      //   baseConfig.options = {
      //     variants: ['Amex', 'MasterCard', 'Discover', 'Visa']
      //   }
      //   break

      // todo: make server use a list of these instead
      case 'Id':
        baseConfig.idTypeEnum = "UUID"
        break

      case 'Number':
        baseConfig.numberRange = [
          "1",
          "2"
        ]
        break

      case 'Price':
        baseConfig.numberRange = [
          "1",
          "2"
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


// tanstack query for simple query
// tanstack virtualization for rendering long list...
// tanstack table for data table

const schema: DataTableRequestType = {
  "sessionID": "123123123234l",
  "fakers": [
    "Harry Potter",
    "Lord of the Rings"
  ],
  "makers": [
    {
      "makerEnum": "First Name",
      "nickname": "first name",
      "nullable": false
    },
    {
      "makerEnum": "Last Name",
      "nickname": "last name",
      "nullable": false
    },
    {
      "makerEnum": "Company Name",
      "nickname": "company name",
      "nullable": false
    },
    {
      "makerEnum": "Email",
      "nickname": "email",
      "nullable": true
    },
    {
      "makerEnum": "Phone Number",
      "nickname": "phone",
      "nullable": false
    },
    {
      "makerEnum": "Address",
      "nickname": "address",
      "nullable": false
    },
    {
      "makerEnum": "Address 2",
      "nickname": "address2",
      "nullable": false
    },
    {
      "makerEnum": "State",
      "nickname": "state",
      "nullable": false
    },
    {
      "makerEnum": "City",
      "nickname": "city",
      "nullable": false
    },
    {
      "makerEnum": "Zip",
      "nickname": "zip",
      "nullable": false
    },
    {
      "makerEnum": "Price",
      "nickname": "price",
      "nullable": false,
      "priceRange": [
        12.99,
        100.24
      ]
    },
    {
      "makerEnum": "Number",
      "nickname": "number of pets",
      "nullable": false,
      "numberRange": [
        "1",
        "2"
      ]
    },
    {
      "makerEnum": "Date",
      "dateRange": [
        "JAN-01-1970",
        "FEB-04-2006"
      ],
      "nickname": "birthday",
      "nullable": false
    },
    {
      "makerEnum": "True/False",
      "nickname": "is attending",
      "nullable": false
    },
    {
      "makerEnum": "Id",
      "idTypeEnum" : "UUID",
      "nickname": "itemId",
      "nullable": false
    },
    {
      "makerEnum": "Credit Card",
      "nickname": "card number",
      "nullable": false
    },
    {
      "makerEnum": "Credit Card",
      "nickname": "card number",
      "nullable": false
    },
    {
      "makerEnum": "Credit Card CVV",
      "nickname": "card CVV",
      "nullable": false
    }
  ]
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

const app = getCurrentInstance()
if (app?.appContext.app) {
  app.appContext.app.use(VueQueryPlugin, {
    queryClient: new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
        },
      },
    })
  })
}


const dataTableItemsQuery = useMutation<DataTableResponseType, Error, DataTableRequestType>({
  mutationFn: async (schema) => {
    const response = await fetch('http://localhost:8181/api/fakermaker/dataTable/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(schema)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  }
});


</script>

<template>

  <!-- select makers -->
  <InputSelector :item-names="makers" v-model="activeMakers" />

  <div class="flex flex-wrap gap-10 mt-10">
    <div v-for="(makerConfig, i) in makerConfigs" :key="i">
      <MakerConfig :makerConfig="makerConfig" />
    </div>
  </div>

  <button
    @click="() => dataTableItemsQuery.mutate(schema)"
    :disabled="dataTableItemsQuery.isPending.value"
    class="px-4 py-2 rounded-lg font-medium transition-colors
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    :class="{
      'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white': !dataTableItemsQuery.isPending.value,
      'bg-blue-300 cursor-not-allowed text-white': dataTableItemsQuery.isPending
    }"
  >
    {{ dataTableItemsQuery.isPending.value ? 'Generating...' : 'Generate Data' }}
  </button>



</template>
