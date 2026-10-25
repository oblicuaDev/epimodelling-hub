/* =========================================================
   Datos de ejemplo (placeholders) – EpiModelling Hub
   Reemplazar por contenido definitivo / origen SharePoint.
   ========================================================= */

window.HUB_DATA = {
  /* ---------- Bibliotecas de documentos (tipo SharePoint) ---------- */
  libraries: {
    convocatoria: {
      title: 'Documentos de la convocatoria',
      showStatus: true,
      items: [
        { type: 'folder', name: 'Términos de referencia', modified: '2026-09-15', by: 'Equipo EpiModelling Hub', children: [
          { type: 'pdf', name: 'Términos de referencia (pendiente de publicación).pdf', modified: '2026-09-15', by: 'Equipo EpiModelling Hub', size: '—', status: 'soon' }
        ]},
        { type: 'folder', name: 'Anexos y formatos', modified: '2026-09-15', by: 'Equipo EpiModelling Hub', children: [
          { type: 'docx', name: 'Anexo 1 – Formato de presentación (pendiente).docx', modified: '2026-09-15', by: 'Equipo EpiModelling Hub', size: '—', status: 'soon' },
          { type: 'xlsx', name: 'Anexo 2 – Formato de presupuesto (pendiente).xlsx', modified: '2026-09-15', by: 'Equipo EpiModelling Hub', size: '—', status: 'soon' }
        ]},
        { type: 'folder', name: 'Adendas', modified: '2026-09-15', by: 'Equipo EpiModelling Hub', children: [] },
        { type: 'folder', name: 'Resultados', modified: '2026-09-15', by: 'Equipo EpiModelling Hub', children: [] },
        { type: 'pdf', name: 'Mecanismos de participación (próximamente).pdf', modified: '2026-09-15', by: 'Equipo EpiModelling Hub', size: '—', status: 'soon' }
      ]
    },

    repositorio: {
      title: 'Documentos de interés',
      showStatus: true,
      items: [
        { type: 'folder', name: 'Documentos institucionales', modified: '2026-09-10', by: 'Equipo EpiModelling Hub', children: [
          { type: 'pdf', name: 'Documento institucional de ejemplo.pdf', modified: '2026-09-10', by: 'Equipo EpiModelling Hub', size: '1,2 MB', status: 'pub' },
          { type: 'pptx', name: 'Presentación institucional de ejemplo.pptx', modified: '2026-09-08', by: 'Equipo EpiModelling Hub', size: '4,8 MB', status: 'pub' }
        ]},
        { type: 'folder', name: 'Documentos técnicos', modified: '2026-09-05', by: 'Equipo EpiModelling Hub', children: [
          { type: 'pdf', name: 'Nota técnica de ejemplo 01.pdf', modified: '2026-09-05', by: 'Equipo EpiModelling Hub', size: '860 KB', status: 'pub' },
          { type: 'pdf', name: 'Nota técnica de ejemplo 02.pdf', modified: '2026-08-28', by: 'Equipo EpiModelling Hub', size: '1,1 MB', status: 'pub' },
          { type: 'docx', name: 'Documento metodológico de ejemplo.docx', modified: '2026-08-20', by: 'Equipo EpiModelling Hub', size: '320 KB', status: 'draft' }
        ]},
        { type: 'folder', name: 'Datos y diccionarios', modified: '2026-08-30', by: 'Equipo EpiModelling Hub', children: [
          { type: 'xlsx', name: 'Diccionario de datos de ejemplo.xlsx', modified: '2026-08-30', by: 'Equipo EpiModelling Hub', size: '95 KB', status: 'pub' },
          { type: 'csv', name: 'Conjunto de datos de ejemplo.csv', modified: '2026-08-30', by: 'Equipo EpiModelling Hub', size: '2,4 MB', status: 'pub' },
          { type: 'zip', name: 'Paquete de datos de ejemplo.zip', modified: '2026-08-29', by: 'Equipo EpiModelling Hub', size: '18,6 MB', status: 'pub' }
        ]},
        { type: 'folder', name: 'Publicaciones', modified: '2026-08-15', by: 'Equipo EpiModelling Hub', children: [] },
        { type: 'pdf', name: 'Documento general de ejemplo.pdf', modified: '2026-09-12', by: 'Equipo EpiModelling Hub', size: '540 KB', status: 'pub' },
        { type: 'docx', name: 'Plantilla de ejemplo.docx', modified: '2026-09-01', by: 'Equipo EpiModelling Hub', size: '48 KB', status: 'pub' }
      ]
    }
  },

  /* ---------- Noticias (placeholders) ---------- */
  newsCategories: ['Todas', 'Hub', 'Convocatoria', 'Eventos', 'Publicaciones'],
  news: [
    { id: 1, category: 'Hub', date: '2026-09-25', title: 'Título de la noticia de ejemplo', summary: 'Espacio reservado para el resumen de la noticia. El contenido será publicado por el equipo del Hub.', img: 'Imagen de la noticia (16:9)' },
    { id: 2, category: 'Convocatoria', date: '2026-09-18', title: 'Título de la noticia de ejemplo', summary: 'Espacio reservado para el resumen de la noticia. El contenido será publicado por el equipo del Hub.', img: 'Imagen de la noticia (16:9)' },
    { id: 3, category: 'Eventos', date: '2026-09-10', title: 'Título de la noticia de ejemplo', summary: 'Espacio reservado para el resumen de la noticia. El contenido será publicado por el equipo del Hub.', img: 'Imagen de la noticia (16:9)' },
    { id: 4, category: 'Publicaciones', date: '2026-08-29', title: 'Título de la noticia de ejemplo', summary: 'Espacio reservado para el resumen de la noticia. El contenido será publicado por el equipo del Hub.', img: 'Imagen de la noticia (16:9)' },
    { id: 5, category: 'Hub', date: '2026-08-20', title: 'Título de la noticia de ejemplo', summary: 'Espacio reservado para el resumen de la noticia. El contenido será publicado por el equipo del Hub.', img: 'Imagen de la noticia (16:9)' },
    { id: 6, category: 'Eventos', date: '2026-08-12', title: 'Título de la noticia de ejemplo', summary: 'Espacio reservado para el resumen de la noticia. El contenido será publicado por el equipo del Hub.', img: 'Imagen de la noticia (16:9)' }
  ]
};
