const eventSlider = document.getElementById('eventSlider');
const addEventForm = document.getElementById('addEventForm');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

let events = [
  {
    title: "JNJD INPT 2025",
    description: "Une compétition de 24h sur le thème ....",
    date: "2025-05-20",
    category: "Compétition",
    lieu:"grande amphi_théatre de l'INPT",
    image: "images/JNJD.jpeg"
  },
  {
    title: "IDEH INPT 2025",
    description: "Rencontrez les clubs, découvrez les labos et nos projets...",
    date: "2025-01-15",
    category: "Compétition",
    lieu:"grande amphi_théatre de l'INPT",
    image: "images/IDEH.jpeg"
  },
  {
    title: "زيارة الى دار المسنين",
    description: "......💙لأن العطاء ليس مجرد فعل، بل شعور يلامس القلوب",
    date: "2025-04-11",
    category: "Club",
    lieu:"دار المسنين ",
    image: "images/visite.jpeg"
  },
  {
    title: "Activité de petit ingénieur",
    description: "Nos petits ingénieurs en herbe ont vécu une aventure inoubliable au centre de l’association IBTASSIM Entre robotique, informatique, ateliers créatifs et rires partagés, cette journée fut une véritable immersion dans l’univers de l’ingénierie et de la découverte. 💡🤖🎨Un grand merci à tous les enfants pour leur enthousiasme, à l’association IBTASSIM pour l’accueil chaleureux, à tous les participants et aux clubs de l’INPT CIT Enactus et Comité mosquée pour leur engagement sans faille. 💙;",
    date: "2025-05-18",
    category: "Club",
    lieu:"Association ibtassim",
    image: "images/petit ingénieur.jpeg"
  }
];

let currentIndex = 0;

// Ajout d'un événement
addEventForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;
  const lieu = document.getElementById('lieu').value;
  const imageFile = document.getElementById('image').files[0];
  

  const reader = new FileReader();
  reader.onload = () => {
    const newEvent = {
      title,
      description,
      date,
      category,
      lieu,
      image: reader.result
    };
    events.push(newEvent);
    currentIndex = 0; 
    renderEvents();
    addEventForm.reset();
  };
  if (imageFile) {
    reader.readAsDataURL(imageFile);
  } else {
    events.push({
      title,
      description,
      date,
      category,
      lieu,
      image: 'images/default.jpeg'
    });
    currentIndex = 0;
    renderEvents();
    addEventForm.reset();
  }
});

// Fonction d’affichage dynamique avec filtrage
function renderEvents() {
  eventSlider.innerHTML = '';

  // Filtrage selon recherche et catégorie
  const filtered = events.filter(evt => {
    return evt.title.toLowerCase().includes(searchInput.value.toLowerCase()) &&
           (categoryFilter.value === '' || evt.category === categoryFilter.value);
  });

  // Ajustement de currentIndex si trop grand
  if (currentIndex > filtered.length - 3) {
    currentIndex = Math.max(filtered.length - 3, 0);
  }

  // Prendre jusqu’à 3 événements à afficher
  const visibleEvents = filtered.slice(currentIndex, currentIndex + 3);

  visibleEvents.forEach((evt, i) => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <img src="${evt.image}" alt="${evt.title}" />
      <div class="event-details">
        <h3>${evt.title}</h3>
        <p>${evt.description.substring(0, 100)}...</p>
        <small>${evt.date} - ${evt.category}</small>
        <div class="card-actions">
          <button class="btn-more" onclick="showMore(${currentIndex + i})">Voir plus</button>
          <button class="btn-edit" onclick="editEvent(${currentIndex + i})">Modifier</button>
          <button class="btn-delete" onclick="deleteEvent(${currentIndex + i})">Supprimer</button>
        </div>
      </div>
    `;
    eventSlider.appendChild(card);
  });

  // Gestion des flèches (désactivation aux bords)
  document.querySelector('.slider-btn.left').disabled = currentIndex === 0;
  document.querySelector('.slider-btn.right').disabled = currentIndex + 3 >= filtered.length;
}

// Fonction de scroll dans les événements filtrés
function scrollEvents(direction) {
  const filtered = events.filter(evt => {
    return evt.title.toLowerCase().includes(searchInput.value.toLowerCase()) &&
           (categoryFilter.value === '' || evt.category === categoryFilter.value);
  });

  currentIndex += direction * 3;

  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex > filtered.length - 3) currentIndex = Math.max(filtered.length - 3, 0);

  renderEvents();
}

// Écouteurs de recherche et filtre
searchInput.addEventListener('input', () => {
  currentIndex = 0;
  renderEvents();
});

categoryFilter.addEventListener('change', () => {
  currentIndex = 0;
  renderEvents();
});

// Fonction pour afficher le détail dans modal
function showMore(index) {
  const evt = events[index];
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h2>${evt.title}</h2>
      <img src="${evt.image}" alt="Event Full" />
      <p><strong>Date:</strong> ${evt.date}</p>
      <p><strong>Catégorie:</strong> ${evt.category}</p>
      <p><strong>lieu:</strong>${evt.lieu}</p>
      <p>${evt.description}</p>
    </div>
  `;
  document.body.appendChild(modal);
}

// Placeholder pour modifier un événement (à implémenter si souhaité)
function editEvent(index) {
  alert("Fonction modification non encore implémentée !");
}

// Supprimer un événement
function deleteEvent(index) {
  if (confirm("Voulez-vous vraiment supprimer cet événement ?")) {
    events.splice(index, 1);
    if (currentIndex > events.length - 3) {
      currentIndex = Math.max(events.length - 3, 0);
    }
    renderEvents();
  }
}

// Défilement automatique toutes les 5 secondes
setInterval(() => {
  scrollEvents(1);
}, 5000);

// Affichage initial
renderEvents();


document.getElementById('eventForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Connexion requise pour publier un événement.");
    return;
  }

  const data = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    location: document.getElementById('location').value,
    user_id: user.id
  };

  const res = await fetch('/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  if (result.success) {
    alert("Événement ajouté avec succès !");
    // Optionnel : reload ou vider le formulaire
  } else {
    alert(result.message || "Erreur");
  }
});
