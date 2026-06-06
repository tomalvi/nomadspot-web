<template>
  <div 
    class="flex items-center  bg-red-600 border border-white/10 shadow-lg rounded-full overflow-hidden transition-all duration-300 ease-in-out origin-right"
    :class="isExpanded ? 'w-80 p-1' : 'w-12 h-12 cursor-pointer hover:bg-red-700 justify-center text-white'"
    @click="openSearch"
  >
    
    <v-text-field
      v-if="isExpanded"
      ref="searchInput"
      v-model="searchQuery"
      placeholder="Buscar ciudad..."
      persistent-placeholder
      prepend-inner-icon="mdi-magnify"
      clearable
      variant="solo"
      density="compact"
      flat
      hide-details
      class="w-full custom-input"
      @update:model-value="emitSearch" 
      @click:clear="onClear"
      @blur="closeSearch"

    ></v-text-field>

    <v-icon 
      v-else 
      icon="mdi-magnify" 
      size="22"
    ></v-icon>

  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const searchQuery = ref('')
const isExpanded = ref(false)
const searchInput = ref(null)

const openSearch = async () => {
  if (isExpanded.value) return
  isExpanded.value = true
  
  await nextTick()
  const inputEl = searchInput.value?.$el.querySelector('input')
  if (inputEl) inputEl.focus()
}

const closeSearch = () => {
  if (!searchQuery.value) {
    isExpanded.value = false
  }
}

  const onClear = () => {
    searchQuery.value = ''
    isExpanded.value = false
  }

  const emit = defineEmits(['searchChange']) 

  const emitSearch = () => {
    emit('searchChange', searchQuery.value)
  }

  // const onClear = () => {
  //   searchQuery.value = ''
  //   emitSearch()
  // }



</script>

<style scoped>
:deep(.v-field) {
  background-color: transparent !important;
  border-radius: 9999px !important;
  color: white !important;
}

:deep(.v-field__input) {
  color: white !important;
}

/* Color del label (Buscar ciudad...) en blanco translúcido */
:deep(.v-label) {
  color: rgba(255, 255, 255, 0.7) !important;
}

/* Color del icono de borrar (X) y la lupa */
:deep(.v-field__prepend-inner .v-icon),
:deep(.v-field__clearable .v-icon) {
  color: white !important;
}
</style>