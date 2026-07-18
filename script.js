const header = document.querySelector('.site-header');
const menuButton = document.getElementById('menuButton');
const mainNav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

menuButton.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;

    document.querySelectorAll('.product-card').forEach(card => {
      const categories = card.dataset.category.split(' ');
      const show = filter === 'todos' || categories.includes(filter);
      card.classList.toggle('hidden', !show);
    });
  });
});

const modal = document.getElementById('productModal');
const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalCode = document.getElementById('modalCode');
const modalDescription = document.getElementById('modalDescription');

document.querySelectorAll('.product-open').forEach(button => {
  button.addEventListener('click', () => {
    modalImage.src = button.dataset.image;
    modalImage.alt = button.dataset.name;
    modalName.textContent = button.dataset.name;
    modalCode.textContent = button.dataset.code;
    modalDescription.textContent = button.dataset.description;
    modal.showModal();
  });
});

document.getElementById('modalClose').addEventListener('click', () => modal.close());
document.getElementById('modalCustomize').addEventListener('click', () => modal.close());
modal.addEventListener('click', event => {
  const rect = modal.getBoundingClientRect();
  const inside = event.clientX >= rect.left && event.clientX <= rect.right &&
                 event.clientY >= rect.top && event.clientY <= rect.bottom;
  if (!inside) modal.close();
});

const productType = document.getElementById('productType');
const lengthInput = document.getElementById('length');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const metalColor = document.getElementById('metalColor');
const woodFinish = document.getElementById('woodFinish');
const previewTitle = document.getElementById('previewTitle');
const previewDimensions = document.getElementById('previewDimensions');
const previewWood = document.getElementById('previewWood');
const previewMetal = document.getElementById('previewMetal');

function updatePreview() {
  previewTitle.textContent = `${productType.value} personalizado`;
  previewDimensions.textContent = `${lengthInput.value} × ${widthInput.value} × ${heightInput.value} cm`;
  previewWood.style.background = woodFinish.value;
  previewMetal.style.borderColor = metalColor.value;
}

[productType, lengthInput, widthInput, heightInput, metalColor, woodFinish]
  .forEach(field => field.addEventListener('input', updatePreview));

updatePreview();

document.getElementById('customizerForm').addEventListener('submit', event => {
  event.preventDefault();
  document.getElementById('formStatus').textContent =
    'Solicitud preparada. Para recibirla, conectaremos este formulario con WhatsApp, correo o una base de datos.';
});

document.getElementById('aiForm').addEventListener('submit', event => {
  event.preventDefault();
  const prompt = document.getElementById('aiPrompt').value.trim();
  const result = document.getElementById('aiResult');

  if (!prompt) {
    document.getElementById('aiPrompt').focus();
    return;
  }

  const words = prompt.toLowerCase();
  let type = 'Mueble Iron Wood personalizado';
  if (words.includes('escritorio')) type = 'Estación de trabajo personalizada';
  else if (words.includes('mesa')) type = 'Mesa industrial personalizada';
  else if (words.includes('rack') || words.includes('tv')) type = 'Rack modular personalizado';
  else if (words.includes('biblioteca') || words.includes('estante')) type = 'Biblioteca modular personalizada';

  document.getElementById('aiResultTitle').textContent = type;
  document.getElementById('aiResultText').textContent =
    `Concepto inicial basado en tu descripción: “${prompt}”. Se propone una estructura metálica de líneas rectas, madera visible y medidas adaptadas al espacio. El siguiente paso será validar dimensiones, materiales y terminaciones para generar el render y el presupuesto.`;

  const tags = ['Metal negro mate', 'Madera natural', 'Fabricación por pedido', 'Medidas personalizadas'];
  const tagsContainer = document.getElementById('aiTags');
  tagsContainer.innerHTML = tags.map(tag => `<span>${tag}</span>`).join('');
  result.hidden = false;
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
