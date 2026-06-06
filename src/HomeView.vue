<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'
import ModalView from '@/assets/ModalView.vue'
import SearchBarComp from '@/assets/SearchBarView.vue'
import FiltersComp from '@/assets/FiltersView.vue'
import ComparativeModalView from './assets/ComparativeModalView.vue'
import { useRoute, useRouter } from 'vue-router'

  const isLoading = ref(true) 
  const ciudades = ref([])
  const isExpanded = ref(false)
  let map = null
  const marcadoresActivos = {}
  const favoriteCities = ref(
    JSON.parse(localStorage.getItem('favorite_cities')) || []
  )
  const mostrarSoloFavoritos = ref(false)
  const route = useRoute()
  const router = useRouter()
  
  const modalAbierto = ref(false)         
  const modalComparativaAbierto = ref(false) 
  const ciudadSelecionada = ref(null)

  watch(
    () => route.name,
    (currentRouteName) => {
      if (currentRouteName === 'comparative-versus') {
        modalComparativaAbierto.value = true
        modalAbierto.value = false
      } 
      else if (currentRouteName === 'city-detail') {
        modalComparativaAbierto.value = false
        
        if (!modalAbierto.value) {
          const city = tuArrayDeCiudades.find(c => c.city_id === route.params.cityId)
          if (city) {
            map.flyTo([city.latitude, city.longitude], 14, { duration: 2 })
            ciudadSelecionada.value = city
            modalAbierto.value = true
          }
        }
      } 
      else {
        modalComparativaAbierto.value = false
        modalAbierto.value = false
      }
    },
    { immediate: true }
  )

  const cerrarCualquierModal = () => {
    modalAbierto.value = false
    modalComparativaAbierto.value = false
    router.push({ name: 'home' }) 
  }

  async function obtenerCiudades() {
    const response = await axios.get('http://localhost:8000/api/cities/panel')
    ciudades.value = response.data;
  }

  function createModal(event, city) {
    map.flyTo([city.latitude, city.longitude], 14, { duration: 2 })
    modalAbierto.value = true
    ciudadSelecionada.value = city

    router.push({ name: 'city-detail', params: { cityName: city.name } })
  }


  function createComparativeModal(event) {
    modalComparativaAbierto.value = !modalComparativaAbierto.value;
  }

  const calcularPorcentajeProgreso = (score) => (Number(score) || 0) * 10;

  function calcularColor(score) {
    if (score > 9) {
      return "purple-accent-3";
    } else if (score >= 7.5) {
      return "green-accent-3";
    } else if (score >= 6.5) {
      return "yellow-accent-3";
    } else if (score >= 5.5) {
      return "orange-accent-3";
    } else {
      return "red-accent-3";
    }
  }

  const redIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'hue-rotate-[140deg] brightness-[0.8] saturate-[3] transition-transform duration-300 hover:-translate-y-2'
  });

  function expandFilters() {
    isExpanded.value = !isExpanded.value;
  }

  function showFavs() {
    mostrarSoloFavoritos.value = !mostrarSoloFavoritos.value;
  }


  const activeFilters = ref(null)

  const handleFiltersChange = (newFilters) => {
    activeFilters.value = newFilters
  }

  const textoBuscado = ref('')
  let temporizadorDebounce = null

  const handleSearchChange = (query) => {
    clearTimeout(temporizadorDebounce)

    temporizadorDebounce = setTimeout(() => {
      textoBuscado.value = query
    }, 300)
  }


  const ciudadesFiltradas = computed(() => {
    if (!isExpanded.value && !activeFilters.value && !textoBuscado.value && !mostrarSoloFavoritos.value) {
      return ciudades.value
    }

    const filters = activeFilters.value || { selectedContinent: 'Todos', costMax: 5000, scoreMin: 1, tempMax: 40, visaFriendly: false }
    const { selectedContinent, costMax, scoreMin, tempMax, visaFriendly } = filters

    return ciudades.value.filter(city => {
      let matchesSearch = true

      if (textoBuscado.value && textoBuscado.value.trim() !== '') {
        const query = textoBuscado.value.toLowerCase().trim()
        
        matchesSearch = (city.name && city.name.toLowerCase().includes(query)) ||
                        (city.country && city.country.toLowerCase().includes(query))
      }

      const matchesContinent = selectedContinent === 'Todos' || 
                              (city.timezone && city.timezone.includes(selectedContinent))
      
      const matchesCost = (Number(city.avg_rent_usd) || 0) <= costMax
      const matchesScore = (Number(city.score_overall) || 0) >= scoreMin
      const matchesTemp = (Number(city.temp || city.temperature) || 0) <= tempMax

      const matchesVisa = !visaFriendly || Number(city.visa_friendly) === 1

      const matchesFavorites = !mostrarSoloFavoritos.value || favoriteCities.value.includes(city.city_id)

      return matchesSearch && matchesContinent && matchesCost && matchesScore && matchesTemp && matchesVisa && matchesFavorites
    })
  })

  function favoriteFilter() {
    console.log('entra')
     return ciudadesFiltradas.value.filter(city => {
      return favoriteCities.value.includes(city.city_id)
    })
  }

  const activarMarcadorMapa = (cityId) => {
    const marker = marcadoresActivos[cityId]
    if (marker) {
      marker.openTooltip() 
    }
  }

  const desactivarMarcadorMapa = (cityId) => {
    const marker = marcadoresActivos[cityId]
    if (marker) {
      marker.closeTooltip() 
    }
  }


  watch(ciudadesFiltradas, (newCities) => {
    if (!map) return

    Object.values(marcadoresActivos).forEach(marker => map.removeLayer(marker))

    for (const key in marcadoresActivos) delete marcadoresActivos[key]

    newCities.forEach(city => {
      if (city.latitude && city.longitude) {
        const markerInstance = L.marker([city.latitude, city.longitude], { icon: redIcon })
          .addTo(map)
          .bindTooltip(city.name, {
            direction: 'top',
            offset: [0, -45], 
            opacity: 0.9
          });

        markerInstance.on('click', (e) => {
          createModal(e, city); 
        });

        marcadoresActivos[city.city_id] = markerInstance;
      }
    });
  }, { deep: true })


  const addFavorite = (city_id) =>{
    if (favoriteCities.value.includes(city_id)) {
      favoriteCities.value = favoriteCities.value.filter(id => id !== city_id)
    } else {
      favoriteCities.value.push(city_id)
      localStorage.setItem('favorite_cities', JSON.stringify(favoriteCities.value))
    }
  }


  const errorPanel = ref(false)

  onMounted(async () => {
    map = L.map('map', {
      maxBounds: [ [-90, -180], [90, 180] ],
      maxBoundsViscosity: 1.0, 
      minZoom: 2.5             
    }).setView([25, 0], 3);

    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      attribution: '© Stadia Maps, © OpenStreetMap'
    }).addTo(map);

    // L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    //   attribution: '© OpenStreetMap contributors © CARTO'
    // }).addTo(map);

    try {
      await obtenerCiudades()
    } catch (error) {
      isLoading.value = false
      errorPanel.value = true
    } finally {
      isLoading.value = false
    }

  })

</script>

<template> 

  <ModalView 
    :mostrar="modalAbierto" 
    :datosCiudad="ciudadSelecionada"
    @cerrar="cerrarCualquierModal" 
    class="backdrop-blur-sm"
  />

  <div class="flex h-screen">
    <div class="w-96 h-full overflow-y-auto bg-white-100 text-white flex-shrink-0" id="panel" style="scrollbar-gutter: stable;">
      <div class="text-center text-xl tracking-wide select-none">
        <span class="font-light text-slate-300">Nomad</span><span class="font-black text-rose-500 drop-shadow-[0_2px_8px_rgba(244,63,94,0.3)]">Spot</span>
      </div>
       <div class="text-l tracking-wide cursor-pointer flex flex-items ml-3 items-center place-items-center">
        <span class="font-black text-rose-500 drop-shadow-[0_2px_8px_rgba(244,63,94,0.3)]">FILTERS</span>
        <v-button @click="expandFilters()"><v-icon class="text-grey" size="15">mdi-arrow-bottom-right-bold-box</v-icon></v-button>
        
        <v-btn @click="showFavs()" variant="text" icon class="ml-auto rounded-full">
          <v-icon class="text-red" size="15">mdi-heart</v-icon>
        </v-btn>


        <!-- <v-button @click="showFavs()" class="ml-auto mr-2">FAVORITES<v-icon class="text-grey" size="15">mdi-heart</v-icon></v-button> -->

      </div>

      <div v-show="isExpanded">
        <FiltersComp @change="handleFiltersChange" />
      </div>

      <!-- cities -->
      <div class="grid grid-cols-1 md:grid-cols-1 gap-3">
        <div v-if="errorPanel">
          <v-btn variant="tonal" class="rounded-xl p-2 ml-2">
            Reintentar
          </v-btn>
        </div>

        <div v-else-if="isLoading" class="grid grid-cols-1 gap-3 pb-6 px-3">
          <div 
            v-for="n in 3" 
            :key="n" 
            class="relative p-4 bg-slate-800/50 border border-slate-700 rounded-xl h-50 flex flex-col justify-between"
          >
            <v-skeleton-loader type="heading" color="transparent" class="w-2/3"></v-skeleton-loader>
            
            <div class="flex gap-4 justify-end my-2">
              <v-skeleton-loader type="avatar" color="transparent"></v-skeleton-loader>
              <v-skeleton-loader type="avatar" color="transparent"></v-skeleton-loader>
              <v-skeleton-loader type="avatar" color="transparent"></v-skeleton-loader>
            </div>

            <v-skeleton-loader type="text" color="transparent" class="w-1/3"></v-skeleton-loader>
          </div>
        </div>

        <TransitionGroup 
          v-else
          name="lista-ciudades" 
          tag="div" 
          class="grid grid-cols-1 gap-3"
        >
          <div 
            v-for="ciudad in ciudadesFiltradas" 
            :key="ciudad.city_id" 
            @click="createModal($event, ciudad)"
            class="relative p-4 bg-slate-800 border border-slate-700 rounded-xl mx-2 overflow-hidden shadow-xl h-50 cursor-pointer hover:scale-102 hover:border-red-500 hover:rounded-2xl"
            @mouseenter="activarMarcadorMapa(ciudad.city_id)"
            @mouseleave="desactivarMarcadorMapa(ciudad.city_id)"
            >

            <img 
              :src="ciudad.images"
              alt="Fondo de playa" 
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div class="flex justify-between relative z-10 items-center">
              
              <div class="flex items-baseline gap-1.5">
                <h3 class="text-xl font-medium text-white">{{ ciudad.name }},</h3>
                <p class="text-base font-light">{{ ciudad.timezone }}</p>
              </div>

              <div>
                <span class="text-2xl leading-none">{{ ciudad.flag }}</span>
              </div>
            </div>



            <div class="grid justify-between relative z-10 grid-cols-4 h-30 items-end pb-2">
              <div class="self-start">
                <p class="text-white-600">{{ ciudad.country }}</p>
                <!-- <p class="text-white-600 text-xs truncate max-w-162">Bangkok, la capital de TailandRattalTailandRattalTailandRattalTailandRattalTailandRattalTailandRattalTailandRattalTailandRattalTailandRattalTailandRattal</p> -->
              </div>
                <!-- SCORE SEGURIDAD -->
                  <v-progress-circular
                    :model-value="calcularPorcentajeProgreso(ciudad.safety_score)"
                    :size="70"
                    :width="8"
                    class="ml-2"
                    :bg-color="'rgba(2, 6, 23, 0.2)'"
                    :color="calcularColor(ciudad.safety_score)"
                    reveal
                    rounded
                  >
                    <v-avatar class="bg-slate-950/20 backdrop-blur-md border border-white/10 flex flex-col justify-center items-center" size="50">
                      <v-icon size="14" class="text-blue mb-0.5">mdi-shield-check-outline</v-icon>
                      <span class="text-xs font-mono font-bold">{{ ciudad.safety_score }}</span>
                    </v-avatar>
                  </v-progress-circular>
                <!-- SCORE CLIMA -->
                  <v-progress-circular
                      :model-value="calcularPorcentajeProgreso(ciudad.score_climate)"
                      :size="70"
                      :width="8"
                      class="ml-2"
                      :bg-color="'rgba(2, 6, 23, 0.2)'"
                      :color="calcularColor(ciudad.score_climate)"
                      reveal
                      rounded
                    >
                      <v-avatar class="bg-slate-950/20 backdrop-blur-md border border-white/10 flex flex-col justify-center items-center" size="50">
                        <v-icon size="14" class="text-orange mb-0.5">mdi-white-balance-sunny</v-icon>
                        <span class="text-xs font-mono font-bold">{{ ciudad.score_climate }}</span>
                      </v-avatar>
                  </v-progress-circular>
                <!-- SCORE GENERAL -->
                  <v-progress-circular
                  :model-value="calcularPorcentajeProgreso(ciudad.score_overall)"
                  :size="70"
                  :width="8"
                  class="ml-2"
                  :bg-color="'rgba(2, 6, 23, 0.2)'"
                  :color="calcularColor(ciudad.score_overall)"
                  reveal
                  rounded
                >
                  <v-avatar class="bg-slate-950/20 backdrop-blur-md border border-white/10 flex flex-col justify-center items-center" size="50">
                    <v-icon size="14" class="text-yellow mb-0.5">mdi-crown</v-icon>
                    <span class="text-xs font-mono font-bold">{{ ciudad.score_overall }}</span>
                  </v-avatar>
                  </v-progress-circular>
            </div>
        
          <div class="flex flex-row-reverse relative z-10 items-center">
            <span 
              class="cursor-pointer transition-all duration-300 transform hover:scale-125 relative z-20"
              @click.stop="addFavorite(ciudad.city_id)"
            >
              <v-icon 
                :color="favoriteCities.includes(ciudad.city_id) ? '#dc2626' : 'grey-lighten-1'"
              >
                {{ favoriteCities.includes(ciudad.city_id) ? 'mdi-heart' : 'mdi-heart-outline' }}
              </v-icon>
            </span> 

          </div>
          
        </div>
        </TransitionGroup>

      </div>

    </div>

    <div class="absolute top-4 right-4 z-[9999] grid gap-2">
      <SearchBarComp class="bg-red-600" @searchChange="handleSearchChange"/>
    </div>
    <div class="absolute top-18 right-4 z-[9999] ">
      <ComparativeModalView class="backdrop-blur-sm "
        :mostrar="modalComparativaAbierto" 
        :ciudades="ciudades"
        @click.self="createComparativeModal($event)" 
        @cerrar="cerrarCualquierModal" 
      />

    </div>


    <div class="flex-1 h-full" id="map"></div>
  </div>

</template>





<style>
#map {
  width: 100vw;
  height: 100vh;
}

.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
}

.lista-ciudades-enter-active,
.lista-ciudades-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.lista-ciudades-move {
  transition: transform 0.4s ease;
}

.lista-ciudades-enter-from,
.lista-ciudades-leave-to {
  opacity: 0;
}

</style>