<template>
  <div class="bg-[#212121]/95 border border-white/10 rounded-2xl p-4 m-2 shadow-2xl text-white backdrop-blur-sm flex flex-col gap-4">
    
    <div class="flex items-center border-b border-white/5 pb-2 justify-end">
      <button 
        @click="resetFilters" 
        class="text-xs text-[#cd2121] hover:text-red-400 font-medium transition-colors cursor-pointer"
      >
        Limpiar Filtros
      </button>
    </div>


    <div>
      <label class="text-[11px] text-gray-400 block mb-1 uppercase font-medium">Continente</label>
      <div class="relative w-full">
        <select
          v-model="filters.selectedContinent"
          class="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2.5 outline-none appearance-none cursor-pointer focus:border-[#cd2121] focus:ring-1 focus:ring-[#cd2121] transition-all"
        >
          <option value="Todos" class="bg-[#212121] text-white">Todos</option>
          <option value="Africa" class="bg-[#212121] text-white">África</option>
          <option value="Europe" class="bg-[#212121] text-white">Europa</option>
          <option value="Asia" class="bg-[#212121] text-white">Asia</option>
          <option value="America" class="bg-[#212121] text-white">América</option>
        </select>

        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <label class="text-[11px] text-gray-400 uppercase font-medium select-none cursor-pointer" for="visa-checkbox">
        Visa friendly
      </label>
      
      <v-checkbox 
        id="visa-checkbox"
        v-model="filters.visaFriendly" 
        hide-details 
        density="compact" 
        color="#b61a1a"
        class="ma-0 pa-0 v-checkbox--compact"
        style="transform: scale(0.85); transform-origin: left center; width: auto; height: auto;"
      ></v-checkbox>
    </div>

    <div>
      <div class="flex justify-between text-[11px] text-gray-400 mb-1 uppercase font-medium">
        <span>Puntuación mínima</span>
        <span class="text-white font-bold">{{ filters.scoreMin }}</span>
      </div>
      <v-slider
        v-model="filters.scoreMin"
        min="1"
        max="10"
        step="0.5"
        color="#b61a1a"
        track-color="rgba(255,255,255,0.1)"
        hide-details
        density="compact"
      ></v-slider>
    </div>

    <div>
      <div class="flex justify-between text-[11px] text-gray-400 mb-1 uppercase font-medium">
        <span>Coste por mes máximo</span>
        <span class="text-white font-bold">{{ filters.costMax }}€</span>
      </div>
      <v-slider
        v-model="filters.costMax"
        min="0"
        max="5000"
        step="50"
        color="#b61a1a"
        track-color="rgba(255,255,255,0.1)"
        hide-details
        density="compact"
      ></v-slider>
    </div>

    <div>
      <label class="text-[11px] text-gray-400 block mb-1 uppercase font-medium">Wifi speed (Mbps)</label>
      <div class="flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-xl justify-between w-full">
        
        <div class="flex items-center gap-1.5 pl-1">
          <span class="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Min</span>
          <input 
            v-model.number="filters.wifiMin"
            type="number" 
            class="bg-[#1a1a1a] text-white font-semibold text-center text-sm w-14 h-8 rounded-lg border border-white/5 focus:border-[#cd2121] focus:ring-1 focus:ring-[#cd2121] outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0"
          />
        </div>

        <span class="text-gray-600 font-light text-sm">—</span>

        <div class="flex items-center gap-1.5 pr-1">
          <input 
            v-model.number="filters.wifiMax"
            type="number" 
            class="bg-[#1a1a1a] text-white font-semibold text-center text-sm w-14 h-8 rounded-lg border border-white/5 focus:border-[#cd2121] focus:ring-1 focus:ring-[#cd2121] outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="500"
          />
          <span class="text-[11px] uppercase tracking-wider text-gray-400 font-medium">Max</span>
        </div>

      </div>
    </div>

    <div class="custom-slider">
      <div class="flex justify-between text-[11px] text-gray-400 mb-1 uppercase font-medium">
        <span>Temperatura máxima</span>
        <span class="text-white font-bold">{{ filters.tempMax }}ºC</span>
      </div>

      <v-slider
        v-model="filters.tempMax"
        min="0"
        max="40"
        step="1"
        color="#b61a1a"
        track-color="rgba(255,255,255,0.1)"
        hide-details
        density="compact"
      >
        <template #append>
          <div class="flex items-center justify-center ml-4 w-7 h-7 overflow-visible">
            <v-icon 
              :icon="solIcono" 
              :class="solColorClase"
              class="will-change-transform"
              :style="{ transform: `scale(${0.8 + (filters.tempMax / 40) * 0.5})` }"
            ></v-icon>
          </div>
        </template>
      </v-slider>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['change'])

const filters = ref({
  visaFriendly: false,
  selectedContinent: 'Todos',
  scoreMin: 1,
  costMax: 5000,
  wifiMin: null,
  wifiMax: null,
  tempMax: 40
})

const solIcono = computed(() => {
  const t = filters.value.tempMax
  if (t < 10) return 'mdi-sun-wireless-outline' 
  if (t < 20) return 'mdi-sun-clock'            
  if (t < 30) return 'mdi-weather-sunny'        
  return 'mdi-sun-thermometer'                                   
})

const solColorClase = computed(() => {
  const t = filters.value.tempMax
  if (t < 10) return 'text-amber-500/50'       
  if (t < 20) return 'text-amber-400' 
  if (t < 30) return 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]' 
  return 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]' 
})

const resetFilters = () => {
  filters.value = {
    visaFriendly: false,
    selectedContinent: 'Todos',
    scoreMin: 1,
    costMax: 5000,
    wifiMin: null,
    wifiMax: null,
    tempMax: 40
  }
}

const emitFilterChange = () => {
  emit('change', { ...filters.value })
}

watch(filters, () => {
  emitFilterChange()
}, { immediate: true, deep: true })
</script>

<style scoped>
.custom-slider :deep(.v-icon) {
  transition: color 0.3s ease, filter 0.3s ease !important;
}
</style>