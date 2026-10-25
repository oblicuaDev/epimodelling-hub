/* Contenido del landing. Sustituir los `url: null` por los enlaces reales
   (video: URL de YouTube/Vimeo embebible o archivo .mp4; material: PDF/ZIP). */
window.T302 = {
  videos: [
    {
      id: 'es',
      num: '1.1',
      title: 'Uso y apropiación del Sistema de Información Wayuu',
      lang: 'Español',
      desc: 'Video de uso y apropiación del Sistema de Información Wayuu en español.',
      url: null
    },
    {
      id: 'wayuu',
      num: '1.2',
      title: 'Uso y apropiación del Sistema de Información Wayuu',
      lang: 'Wayuunaiki',
      desc: 'Video de uso y apropiación del Sistema de Información Wayuu en Wayuunaiki.',
      url: null
    }
  ],

  materiales: [
    { num: '1.3.1', icon: 'book',      title: 'Cartilla',                 desc: 'Guía de consulta sobre el Sistema de Información Wayuu.', type: 'PDF', url: null },
    { num: '1.3.2', icon: 'edit',      title: 'Cuadernillo de actividades', desc: 'Actividades para reforzar el uso y la apropiación del sistema.', type: 'PDF', url: null },
    { num: '1.3.3', icon: 'cards',     title: 'Juego Concéntrese',        desc: 'Instrucciones y tarjetas del juego de parejas.', type: 'PDF', url: null, game: true },
    { num: '1.3.4', icon: 'footsteps', title: 'Paso a paso',              desc: 'Instructivo ilustrado para navegar el sistema.', type: 'PDF', url: null }
  ],

  /* Indicadores de desnutrición validados con las comunidades del Pueblo Wayuu.
     `img: null` muestra un placeholder; use la ruta de la imagen cuando esté lista. */
  indicadores: [
    { title: 'Indicador 1',  desc: 'Descripción del indicador validado.', img: null },
    { title: 'Indicador 2',  desc: 'Descripción del indicador validado.', img: null },
    { title: 'Indicador 3',  desc: 'Descripción del indicador validado.', img: null },
    { title: 'Indicador 4',  desc: 'Descripción del indicador validado.', img: null },
    { title: 'Indicador 5',  desc: 'Descripción del indicador validado.', img: null },
    { title: 'Indicador 6',  desc: 'Descripción del indicador validado.', img: null },
    { title: 'Indicador 7',  desc: 'Descripción del indicador validado.', img: null },
    { title: 'Indicador 8',  desc: 'Descripción del indicador validado.', img: null },
    { title: 'Indicador 9',  desc: 'Descripción del indicador validado.', img: null },
    { title: 'Indicador 10', desc: 'Descripción del indicador validado.', img: null },
    { title: 'Indicador 11', desc: 'Descripción del indicador validado.', img: null },
    { title: 'Indicador 12', desc: 'Descripción del indicador validado.', img: null }
  ],

  /* Parejas del juego Concéntrese (placeholders). `icon` es un id del sprite. */
  juego: [
    { id: 'a', icon: 'leaf',   label: 'Concepto A' },
    { id: 'b', icon: 'drop',   label: 'Concepto B' },
    { id: 'c', icon: 'sun',    label: 'Concepto C' },
    { id: 'd', icon: 'home',   label: 'Concepto D' },
    { id: 'e', icon: 'users',  label: 'Concepto E' },
    { id: 'f', icon: 'heart',  label: 'Concepto F' },
    { id: 'g', icon: 'chart',  label: 'Concepto G' },
    { id: 'h', icon: 'map',    label: 'Concepto H' }
  ]
};
