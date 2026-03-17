// Lista de municipios de Antioquia organizados por región
export const municipiosAntioquia = {
  // Valle de Aburrá (Área Metropolitana)
  'Valle de Aburrá': [
    'Medellín',
    'Bello',
    'Itagüí',
    'Envigado',
    'Sabaneta',
    'La Estrella',
    'Caldas',
    'Copacabana',
    'Girardota',
    'Barbosa'
  ],
  
  // Oriente Antioqueño
  'Oriente': [
    'Rionegro',
    'Marinilla',
    'El Retiro',
    'La Ceja',
    'El Carmen de Viboral',
    'Guarne',
    'San Vicente',
    'El Santuario',
    'La Unión',
    'Sonsón'
  ],
  
  // Urabá
  'Urabá': [
    'Apartadó',
    'Turbo',
    'Carepa',
    'Chigorodó',
    'Necoclí',
    'Arboletes',
    'San Juan de Urabá',
    'San Pedro de Urabá'
  ],
  
  // Norte
  'Norte': [
    'Santa Rosa de Osos',
    'Yarumal',
    'Belmira',
    'Entrerríos',
    'San Pedro de los Milagros',
    'Don Matías'
  ],
  
  // Occidente
  'Occidente': [
    'Santa Fe de Antioquia',
    'San Jerónimo',
    'Sopetrán',
    'Ebéjico',
    'Heliconia'
  ],
  
  // Suroeste
  'Suroeste': [
    'Andes',
    'Jardín',
    'Támesis',
    'Jericó',
    'Ciudad Bolívar'
  ],
  
  // Otros municipios importantes
  'Otros': [
    'Puerto Berrío',
    'Caucasia',
    'Segovia',
    'Remedios',
    'Yondó',
    'El Bagre',
    'Nechí',
    'Tarazá',
    'Zaragoza'
  ]
}

// Lista plana de todos los municipios para select simple
export const todosMunicipios = Object.values(municipiosAntioquia)
  .flat()
  .sort()

// Lugares/Barrios importantes de Medellín
export const lugaresMedellin = [
  'El Poblado',
  'Laureles',
  'Envigado Centro',
  'Sabaneta Centro',
  'Bello Centro',
  'Itagüí Centro',
  'Parque Lleras',
  'Manila',
  'Estadio',
  'Centro',
  'Belén',
  'Buenos Aires',
  'La Candelaria',
  'Aranjuez',
  'Castilla',
  'Manrique',
  'Santa Cruz',
  'Robledo',
  'San Javier',
  'La América',
  'Villa Hermosa',
  'Guayabal'
]

// Función para obtener municipios por región
export const getMunicipiosPorRegion = (region) => {
  return municipiosAntioquia[region] || []
}

// Función para obtener todas las regiones
export const getRegiones = () => {
  return Object.keys(municipiosAntioquia)
}

// Función para buscar municipio
export const buscarMunicipio = (termino) => {
  if (!termino) return todosMunicipios
  
  const terminoLower = termino.toLowerCase()
  return todosMunicipios.filter(m => 
    m.toLowerCase().includes(terminoLower)
  )
}
