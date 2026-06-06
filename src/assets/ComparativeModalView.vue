<template>

  <v-dialog v-if="isExpanded" :model-value="mostrar" max-width="1000" width="100%" persistent>

      <v-card v-if="ganador" class="bg-zinc-9500 text-white overflow-auto scrollbar-thin [scrollbar-color:#334155_transparent] p-6 rounded-2xl border border-zinc-200/80 max-w-4xl">

      <!-- Header -->
      <div class="flex items-center justify-between mb-6 border-b border-zinc-200/40 pb-4">
        <span class="text-sm font-black tracking-widest text-rose-500 uppercase">
          🏆 Versus — Winner
        </span>
        <div class="flex items-center gap-2">
          <button 
            @click="ganador = false"
            class="px-3 py-1.5 bg-zinc-9500 border border-zinc-200 hover:border-zinc-200 text-slate-300 hover:text-white rounded-xl text-xs font-black tracking-wider transition-all cursor-pointer active:scale-95"
          >
            ← Volver
          </button>
          <button 
            @click="close"
            class="bg-zinc-9500 border border-zinc-200 hover:bg-rose-500/10 hover:border-zinc-500/30 text-slate-400 hover:text-rose-500 rounded-xl w-8 h-8 flex items-center justify-center transition-all cursor-pointer"
          >✕</button>
        </div>
      </div>

      <v-img
        :src="ganador.images" 
        height="300"
        cover
        class="rounded-xl overflow-hidden border border-zinc-200"
      >
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex flex-col justify-end p-6">
          <span class="text-xs font-black tracking-widest text-rose-500 uppercase mb-2">🏆 Ciudad Ganadora</span>
          <h2 class="text-4xl font-black tracking-wide uppercase text-white m-0 leading-none">
            {{ ganador.name }}
          </h2>
          <p class="text-slate-400 text-sm mt-1">{{ ganador.flag }} {{ ganador.country }}</p>
        </div>
      </v-img>

      <!-- Stats ganador -->
      <div class="grid grid-cols-4 gap-3 mt-4">
        <div class="text-center bg-zinc-9500 rounded-xl p-3 border border-zinc-200">
          <p class="text-xs text-slate-400 mb-1">💰 Cost/mo</p>
          <p class="text-white font-bold text-sm">${{ ganador.cost_per_month }}</p>
        </div>
        <div class="text-center bg-zinc-9500 rounded-xl p-3 border border-zinc-200">
          <p class="text-xs text-slate-400 mb-1">🌐 Internet</p>
          <p class="text-white font-bold text-sm">{{ ganador.internet_speed }} Mbps</p>
        </div>
        <div class="text-center bg-zinc-9500 rounded-xl p-3 border border-zinc-200">
          <p class="text-xs text-slate-400 mb-1">🛡️ Safety</p>
          <p class="text-white font-bold text-sm">{{ ganador.safety_score }}/10</p>
        </div>
        <div class="text-center bg-zinc-9500 rounded-xl p-3 border border-zinc-200">
          <p class="text-xs text-slate-400 mb-1">⭐ Global</p>
          <p class="text-purple-400 font-bold text-sm">{{ ganador.score_overall }}/10</p>
        </div>
      </div>

    </v-card>


    <v-card v-else class="bg-zinc-9500 text-white overflow-auto scrollbar-thin [scrollbar-color:#334155_transparent] p-6 rounded-2xl border border-zinc-200/80 max-w-4xl mx-auto">

      <div class="flex items-center justify-between mb-6 border-b border-zinc-200/40 pb-4">
        <span class="text-sm font-black tracking-widest text-rose-500 uppercase">
          ⚔ Versus Mode
        </span>
        <div class="flex items-center gap-2">
          <button 
            @click="close"
            class="ml-4 bg-zinc-9500 border border-zinc-200 hover:bg-rose-500/10 hover:border-zinc-500/30 text-slate-400 hover:text-rose-500 rounded-xl w-8 h-8 flex items-center justify-center transition-all cursor-pointer"
          >✕</button>
        </div>
      </div>

      <!-- Selectors -->
      <div class="relative grid grid-cols-2 gap-6 bg-zinc-9500/40 rounded-2xl border border-zinc-200/50 p-6">
        
        <!-- VS divider -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div class="bg-zinc-9500 border-2 border-zinc-200 w-10 h-10 mb-15 rounded-full flex items-center justify-center">
            <span class="text-xs font-black text-slate-400 italic">VS</span>
          </div>
        </div>

        <div class="space-y-3">
          <label class="text-xs font-black tracking-widest text-slate-400 uppercase text-left">Ciudad A</label>
          <select 
            v-model="selectedCityA"
            class="w-full bg-zinc-9500 border border-zinc-200 hover:border-zinc-500/50 text-white font-semibold text-sm rounded-xl px-4 py-3 cursor-pointer transition-all focus:outline-none focus:border-zinc-500"
          >
            <option value="" disabled class="text-slate-500">Elige una ciudad...</option>
            <option v-for="city in ciudades" :key="city.city_id" :value="city.city_id" class="bg-zinc-800">
              {{ city.name }} ({{ city.country }})
            </option>
          </select>
        </div>

        <div class="space-y-3 ">
          <label class="text-xs font-black tracking-widest text-slate-400 uppercase  ml-79 text-right">Ciudad B</label>

          <select 
            v-model="selectedCityB"
            class="w-full bg-zinc-9500 border border-zinc-200 hover:border-zinc-500/50 text-white font-semibold text-sm rounded-xl px-4 py-3 cursor-pointer transition-all focus:outline-none focus:border-zinc-500"
          >
            <option value="" disabled class="text-slate-500">Elige una ciudad...</option>
            <option v-for="city in ciudades" :key="city.city_id" :value="city.city_id" class="bg-zinc-800">
              {{ city.name }} ({{ city.country }})
            </option>
          </select>
        </div>

      </div>

      <div class="mt-6 text-center">
        <button 
          @click="versus()"
          class="px-10 py-3 bg-rose-500 hover:bg-rose-600 text-white font-black tracking-widest text-sm uppercase rounded-xl transition-all active:scale-95 shadow-lg shadow-rose-500/20"
        >
          ⚔ Comparar ciudades
        </button>
      </div>

    </v-card>

  </v-dialog>

  <div v-else 
    class="flex items-center  bg-red-600 border border-white/10 shadow-lg rounded-full overflow-hidden transition-all duration-300 ease-in-out origin-right"
    :class="isExpanded ? 'w-80 p-1' : 'w-12 h-12 cursor-pointer hover:bg-red-700 justify-center text-white'"
    @click="openSearch"
  >
    <v-icon 
      icon="mdi-boxing-glove" 
      size="22"
    ></v-icon>

  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'

  const isTransitioning = ref(false)

  const isExpanded = ref(false)
  const props = defineProps({
    mostrar: Boolean,
    ciudades: Array 
  })
 
  const router = useRouter()

  const openSearch = async () => {
    if (isExpanded.value || isTransitioning.value) return
    
    isTransitioning.value = true
    isExpanded.value = true
    
    router.push({ name: 'comparative-versus' }) 
    
    await nextTick()
    
    setTimeout(() => {
      isTransitioning.value = false
    }, 300)
  }
  

  const close = () => {
    emit('cerrar') 
  }

  watch(() => props.mostrar, (nuevoValor) => {
    if (!nuevoValor) {
      isExpanded.value = false
    }
  })


  const emit = defineEmits(['searchChange', 'close', 'open'])

  const emitSearch = () => {
    emit('searchChange', searchQuery.value)
  }

  const selectedCityA = ref('')
  const selectedCityB = ref('')
  const ganador = ref(false)

  const versus = () => {
    let cityAScore = 0
    let cityBScore = 0

    const datosCiudadA = props.ciudades.find(city => city.city_id === selectedCityA.value)
    const datosCiudadB = props.ciudades.find(city => city.city_id === selectedCityB.value)

    if (!datosCiudadA || !datosCiudadB) return

    const metricas = ['score_overall', 'score_climate', 'score_cost', 'safety_score', 'internet_speed']

    metricas.forEach(metrica => {
      const valorA = datosCiudadA[metrica]
      const valorB = datosCiudadB[metrica]

      if (valorA > valorB) {
        cityAScore++
      } else if (valorA < valorB) {
        cityBScore++
      } else {
        cityAScore++
        cityBScore++
      }
    })
    
    ganador.value = cityAScore > cityBScore ? datosCiudadA : datosCiudadB
  }


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