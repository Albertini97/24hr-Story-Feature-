// Seleccionar elementos del DOM
const storiesList = document.querySelector('.stories-list');
const addStoryButton = document.getElementById('addStoryButton');
const storyViewer = document.getElementById('storyViewer');
const storyContent = document.getElementById('storyContent');
const closeStoryViewer = document.getElementById('closeStoryViewer');

// Cargar historias guardadas desde localStorage
function loadStories() {
  const stories = JSON.parse(localStorage.getItem('stories')) || [];
  storiesList.innerHTML = ''; // Limpiar lista

  stories.forEach((story, index) => {
    const storyItem = document.createElement('div');
    storyItem.classList.add('story-item');
    storyItem.style.backgroundImage = `url(${story.image})`;
    storyItem.style.backgroundSize = 'cover';
    storyItem.style.backgroundPosition = 'center';

    // Mostrar historia al hacer clic
    storyItem.addEventListener('click', () => showStory(story.image));

    storiesList.appendChild(storyItem);
  });

  // Agregar botón de nueva historia
  storiesList.appendChild(addStoryButton);
}

// Mostrar una historia en el visor
function showStory(image) {
  storyContent.innerHTML = `<img src="${image}" alt="Historia">`;
  storyViewer.style.display = 'flex';
}

// Cerrar el visor de historias
closeStoryViewer.addEventListener('click', () => {
  storyViewer.style.display = 'none';
});

// Subir una nueva historia
addStoryButton.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.onchange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target.result;

        // Guardar la historia en localStorage
        const stories = JSON.parse(localStorage.getItem('stories')) || [];
        stories.push({ image: base64Image, timestamp: Date.now() });
        localStorage.setItem('stories', JSON.stringify(stories));

        // Recargar la lista de historias
        loadStories();

        // Eliminar la historia después de 24 horas
        setTimeout(() => {
          removeStory(stories.length - 1);
        }, 24 * 60 * 60 * 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  input.click();
});

// Eliminar una historia
function removeStory(index) {
  let stories = JSON.parse(localStorage.getItem('stories')) || [];
  stories.splice(index, 1);
  localStorage.setItem('stories', JSON.stringify(stories));
  loadStories();
}

// Limpiar historias antiguas al cargar la página
function cleanOldStories() {
  let stories = JSON.parse(localStorage.getItem('stories')) || [];
  const now = Date.now();
  stories = stories.filter(story => (now - story.timestamp) < 24 * 60 * 60 * 1000);
  localStorage.setItem('stories', JSON.stringify(stories));
}

// Inicializar la aplicación
cleanOldStories();
loadStories();