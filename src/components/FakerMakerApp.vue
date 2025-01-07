<script setup lang="ts">
import InputSelector from './InputSelector.vue'
import MakerConfigGeneric from './MakerConfigGeneric.vue'
import { ref, watch } from 'vue'

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

const activeMakers = ref<Array<string>>([])
const makerConfigs = ref<MakerConfig[]>([])

watch(activeMakers, (newMakers, oldMakers) => {
  // Find newly added makers
  const addedMakers = newMakers.filter(maker => !oldMakers.includes(maker))

  // For each new maker, create its config
  addedMakers.forEach(maker => {
    const baseConfig: MakerConfig = {
      id: `${maker.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      type: maker,
      title: maker,
    }

    // Add specific configurations based on maker type
    switch (maker) {
      case 'Date':
        baseConfig.options = {
          nullable: true,
          format: 'YYYY-MM-DD'
        }
        break

      case 'Credit Card':
        baseConfig.options = {
          nullable: true,
          variants: ['Amex', 'MasterCard', 'Discover', 'Visa']
        }
        break

      case 'Id':
        baseConfig.options = {
          variants: ['UUID', 'NanoID', 'ShortID', 'NumericID', 'ObjectID']
        }
        break

      case 'True/False':
        baseConfig.options = {
          nullable: true
        }
        break

      // Add more cases as needed
    }

    makerConfigs.value.push(baseConfig)
  })

  // Remove configs for removed makers
  const removedMakers = oldMakers.filter(maker => !newMakers.includes(maker))
  removedMakers.forEach(maker => {
    const index = makerConfigs.value.findIndex(config => config.type === maker)
    if (index !== -1) {
      makerConfigs.value.splice(index, 1)
    }
  })
}, { deep: true })

</script>

<template>

  <!-- select makers -->
  <InputSelector :item-names="makers" v-model="activeMakers" />
  <!-- iterate over makers, create -->

  <div class="mt-10"></div>

  <!-- build the schema object -->
  <MakerConfigGeneric />


</template>
