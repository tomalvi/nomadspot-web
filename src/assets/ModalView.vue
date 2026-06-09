<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    mostrar: Boolean,
    datosCiudad: Object 
  })

  const emit = defineEmits(['cerrar'])


  const calcularPorcentajeProgreso = (score) => (Number(score) || 0) * 10;
  function calcularColor(score) {
    console.log(score)
    if (score >= 9) {
      return "purple-accent-3";
    } else if (score >= 7.5) {
      return "green-accent-3";
    } else if (score >= 6.5) {
      return "yellow-accent-3";
    } else if (score > 5) {
      return "orange-accent-3";
    } else {
      return "red-accent-3";
    }
  }

  const wikilink = (city) => 'https://es.wikipedia.org/wiki/' + city.toLowerCase();

  const bars = computed(() => {
    if (!props.datosCiudad) return [] 
    
    return Array.from({ length: 50 }, (_, i) => {
      return Math.max(
        2, 
        Math.min(14, Math.sin(i * 0.5 + props.datosCiudad.internet_speed) * 5 + props.datosCiudad.internet_speed / 20)
      )
    })
  })

</script>

<template>
  <v-dialog :model-value="mostrar" max-width="1000" width="100%" persistent>
    <v-card v-if="datosCiudad" class="text-white overflow-auto scrollbar-thin [scrollbar-color:#334155_transparent] bg-white-100">
      <v-img
        :src="datosCiudad.images"
        height="300"
        cover
        class="relative"
      >
        <button 
          @click="emit('cerrar')"
          class="absolute top-3 right-3 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-all cursor-pointer backdrop-blur-sm"
        >
          ✕
        </button>

        <a 
          :href="wikilink(datosCiudad.name)" 
          target="_blank" 
          rel="noopener noreferrer"
          class="absolute top-3 right-14 z-10 bg-black/40 hover:bg-black/70 rounded-full w-8 h-8 flex items-center justify-center transition-all backdrop-blur-sm"
        >
          <img src="/assets/wiki.png" alt="Wikipedia" class="w-5 h-5 object-contain"/>
        </a>

        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent flex flex-col justify-end p-5">
          
          <div class="flex items-center gap-2 mb-2">
            <span class="text-slate-400 text-xs font-medium uppercase tracking-widest">{{ datosCiudad.country }}</span>
            <span v-if="datosCiudad.visa_friendly" class="ml-2 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              ✈ Visa Friendly
            </span>
          </div>

          <h2 class="text-4xl font-black tracking-wide uppercase m-0 leading-none">
            <span class="text-white">{{ datosCiudad.name.split(' ')[0] }}</span>
            <span v-if="datosCiudad.name.split(' ').length > 1" class="text-rose-500 ml-2">
              {{ datosCiudad.name.split(' ').slice(1).join(' ') }}
            </span>
          </h2>

        </div>
      </v-img>
      
      <div class="flex pb-2">
        <!-- STATS -->
        <div class="v-card-text pt-4 px-3 space-y-3 max-w-min">
  
          <div class="grid grid-cols-3 gap-2 py-3 px-2 bg-slate-900/40 p-3 border border-slate-800 backdrop-blur-md rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
            <div class="text-center flex flex-col items-center justify-center">
              <div class="flex items-center gap-1 mb-0.5">
                <v-icon color="rose-500" size="15">mdi-cash-check</v-icon>
                <span class="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Cost/mo</span>
              </div>
              <p class="text-rose-500 font-black text-base">${{ datosCiudad.cost_per_month }}</p>
            </div>
            
            <div class="text-center flex flex-col items-center justify-center border-x border-rose-500/20">
              <div class="flex items-center gap-1 mb-0.5">
                <v-icon color="rose-500" size="15">mdi-cash-multiple</v-icon>
                <span class="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Avg Rent</span>
              </div>
              <p class="text-rose-500 font-black text-base">${{ datosCiudad.avg_rent_usd }}</p>
            </div>
            
            <div class="text-center flex flex-col items-center justify-center">
              <div class="flex items-center gap-1 mb-0.5">
                <v-icon color="rose-500" size="15">mdi-thermometer</v-icon>
                <span class="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Avg Temp</span>
              </div>
              <p class="text-rose-500 font-black text-base">{{ datosCiudad.avg_temp_c ?? 20 }}°C</p>
            </div>
          </div>

          <div class="flex items-center justify-between bg-slate-900/40 p-3 border border-slate-800 backdrop-blur-sm rounded-xl">
            <span class="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              Población actual
            </span>
            <div class="flex items-center gap-2 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">
              <span class="text-rose-500 font-black text-sm tracking-wide">
                {{ datosCiudad.population || '?!' }}
              </span>
              <v-icon size="16" color="rose-500">mdi-account-group</v-icon>
            </div>
          </div>

          <div class="p-4 bg-slate-900/40 border border-slate-800 backdrop-blur-sm rounded-xl space-y-4 text-left">
            <div class="flex flex-col gap-1 w-full">
              <div class="flex justify-between items-center text-xs font-bold tracking-wider text-slate-400 uppercase">
                <span>Seguridad 🛡️</span>
                <span class="text-sm font-black">{{ datosCiudad.safety_score }}/10</span>
              </div>
              <v-progress-linear 
                :model-value="calcularPorcentajeProgreso(datosCiudad.safety_score)" 
                :height="8" 
                class="m-0 rounded-full" 
                :color="calcularColor(datosCiudad.safety_score)" 
              ></v-progress-linear>
            </div>

            <div class="flex flex-col gap-1 w-full">
              <div class="flex justify-between items-center text-xs font-bold tracking-wider text-slate-400 uppercase">
                <span>Clima 🌤️</span>
                <span class="text-sm font-black">{{ datosCiudad.score_climate }}/10</span>
              </div>
              <v-progress-linear 
                :model-value="calcularPorcentajeProgreso(datosCiudad.score_climate)" 
                :height="8" 
                class="m-0 rounded-full" 
                :color="calcularColor(datosCiudad.score_climate)" 
              ></v-progress-linear>
            </div>
            
            <div class="flex flex-col gap-1 w-full">
              <div class="flex justify-between items-center text-xs font-bold tracking-wider text-slate-400 uppercase">
                <span>Coste mensual 💰</span>
                <span class="text-sm font-black">{{ datosCiudad.score_cost }}/10</span>
              </div>
              <v-progress-linear 
                :model-value="calcularPorcentajeProgreso(datosCiudad.score_cost)" 
                :height="8" 
                class="m-0 rounded-full" 
                :color="calcularColor(datosCiudad.score_cost)" 
              ></v-progress-linear>
            </div>

            <div class="flex flex-col gap-1 w-full">
              <div class="flex justify-between items-center text-xs font-bold tracking-wider text-slate-400 uppercase">
                <span>Global ⭐</span>
                <span class="text-sm font-black">{{ datosCiudad.score_overall }}/10</span>
              </div>
              <v-progress-linear 
                :model-value="calcularPorcentajeProgreso(datosCiudad.score_overall)" 
                :height="8" 
                class="m-0 rounded-full" 
                :color="calcularColor(datosCiudad.score_overall)" 

              ></v-progress-linear>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 bg-slate-900/40 border border-slate-800 backdrop-blur-sm rounded-xl">
            <div class="flex flex-col text-left justify-center">
              <span class="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                Velocidad
              </span>
              <div class="flex items-baseline gap-1">
                <span class="text-2xl font-black text-white tracking-tight animate-pulse">
                  {{ datosCiudad.internet_speed }}
                </span>
                <span class="text-xs text-rose-500 font-bold uppercase tracking-wide">Mbps</span>
              </div>
            </div>

            <div class="flex items-end gap-[3px] px-2 bg-rose-500/5 rounded-lg border border-rose-500/10 py-1.5 ml-2 mt-2">
              <div
                v-for="(h, i) in bars"
                :key="i"
                class="w-[3px] bg-rose-500 rounded-full origin-bottom animate-fade animate-infinite"
                :style="{ 
                  height: `${h * 3}px`, 
                  animationDelay: `${i * 0.04}s`, 
                  animationDuration: '0.7s'       
                }"
              ></div>
            </div>
          </div>

        </div>

        <!-- WINDY EMBED -->
        <v-card-text class="pr-2 space-y-4">
          <div class="w-full h-111.5 rounded-lg overflow-hidden mt-4">
            <iframe 
              width="100%" 
              height="100%" 
              :src="`https://embed.windy.com/embed2.html?lat=${datosCiudad.latitude}&lon=${datosCiudad.longitude}&zoom=7&level=surface&overlay=temp&menu=&message=&marker=&calendar=&pressure=&type=map&location=coordinates&detail=&detailLat=${datosCiudad.latitude}&detailLon=${datosCiudad.longitude}&metricWind=default&metricTemp=default&radarRange=-1`" 
              frameborder="0"
            ></iframe>
          </div>

        </v-card-text>
      </div>
    </v-card>
  </v-dialog>
</template>