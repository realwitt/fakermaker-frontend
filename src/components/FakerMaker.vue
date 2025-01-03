<script setup lang="ts">
import InputSelector from './InputSelector.vue'
import MakerConfigGeneric from './MakerConfigGeneric.vue'
import { ref } from 'vue'

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

</script>

<template>

  <!-- select makers -->
  <InputSelector :item-names="makers" v-model="activeMakers" />
  <!-- iterate over makers, create -->

  <!-- build the schema object -->
  <MakerConfigGeneric />

  <div class="text-text-grey mt-3">some other component</div>

</template>
