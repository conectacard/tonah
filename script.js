const CONFIG = {
    whatsapp: "5214491472336",
    whatsappAdicional: "5214491472336",
    sitioWeb: "https://demo-altpro.com/",
    facebook: "https://www.facebook.com/TNToficial0?locale=es_LA",
    instagram: "https://www.instagram.com/tonahelhombreorqesta?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==",
    maps: "https://maps.app.goo.gl/jj73KYa3qyLELgiG6", 
    youtubeUrl: "https://www.youtube.com/watch?v=U0DZpM8CgDQ",
    
    // Propiedad dinámica conectada al sistema i18n
    get textos() {
        const lang = localStorage.getItem('selectedLanguage') || 'es';
        const tObj = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : {};
        
        return {
            cat2: { 
                t: tObj.cat2_t || "PORTAFOLIO DE IMAGENES", 
                c: tObj.cat2_c || "Todos los días ensayo, ajusto mi sistema de poleas y pedales y perfecciono cada detalle de mi show..." 
            },
            cat3: { 
                t: tObj.cat3_t || "EL PODER DE LA MUSICA", 
                c: tObj.cat3_c || "Mi mayor fortaleza es la versatilidad combinada con la autenticidad..." 
            }
        };
    }
};
let currentGallery = [];
let currentIndex = 0;
let isMuted = false;
let currentGatewayState = { citas: false, ventas: false, cotizar: false };
let globalCompiledTicketText = "";

function openYouTubeVideo() { 
    playClick(); 
    const overlay = document.getElementById('video-lightbox-overlay');
    const iframe = document.getElementById('video-lightbox-frame');
    let videoId = "4LLMlYBo54I"; 
    if(CONFIG.youtubeUrl.includes("shorts/")) { videoId = CONFIG.youtubeUrl.split("shorts/")[1].split("?")[0]; } 
    else if(CONFIG.youtubeUrl.includes("v=")) { videoId = CONFIG.youtubeUrl.split("v=")[1].split("&")[0]; }
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    overlay.style.display = 'flex';
}

function closeVideoLightbox() {
    playClick();
    const overlay = document.getElementById('video-lightbox-overlay');
    const iframe = document.getElementById('video-lightbox-frame');
    iframe.src = ""; 
    overlay.style.display = 'none';
}

function openProfileZoom() {
    playClick();
    const imgElement = document.getElementById('profile-pic-img');
    if(imgElement) { const src = imgElement.src; openLightbox(src, [src], true); }
}

function showAppContent(cat) {
    playClick();
    document.getElementById('dynamic-content-layer').style.display = 'flex';
    document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
    const pane = document.getElementById(`${cat}-pane`);
    if(pane) pane.style.display = 'flex';
    if(cat !== 'cat4') renderGallery(cat);
}

function renderGallery(cat) {
    const grid = document.getElementById(`grid-${cat}`);
    if(!grid) return; 
    grid.innerHTML = '';
    
    const titleHeader = document.createElement('h2');
    titleHeader.className = 'gallery-title-white';
    titleHeader.innerText = CONFIG.textos[cat].t;
    grid.appendChild(titleHeader);
    
    // Si es cat3 ya no cargamos imágenes, dejamos el arreglo vacío para esa categoría
    const imgCount = (cat === 'cat3') ? 0 : (cat === 'cat1' || cat === 'cat2') ? 6 : 4;
    const imgs = [];
    for(let i = 1; i <= imgCount; i++) { imgs.push(`assets/gallery/${cat}/${i}.jpg`); }
   
    const rowGrid = document.createElement('div');
    rowGrid.className = 'quad-row-grid';
    imgs.forEach((src, index) => {
        const posClass = (index % 2 === 0) ? 'pos-left' : 'pos-right';
        rowGrid.appendChild(createPol(src, posClass, imgs));
    });
    grid.appendChild(rowGrid);
   
    if (cat === 'cat3' || cat === 'cat2') {
        const videoContainer = document.createElement('div');
        videoContainer.style.cssText = "display: flex; flex-direction: column; gap: 12px; margin-top: 20px; width: 100%; box-sizing: border-box; background: #fdfdfd; padding: 20px; border-radius: 12px; border: 1px solid #eee;";
       
        if (cat === 'cat3') {
            const lang = localStorage.getItem('selectedLanguage') || 'es';
            const tObj = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : {};
            
            videoContainer.innerHTML = `
                <h3 style="color: #f80101; font-size: 1.1rem; text-align: center; margin-bottom: 10px; margin-top: 0;">${tObj.lbl_mis_fortalezas || 'Mis Fortalezas en Video'}</h3>
                <a href="https://www.youtube.com/shorts/9oPnXe_ESRE" target="_blank" style="display: block; width: 100%; box-sizing: border-box; background: #000; color: #fff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 0.85rem; text-align: center; border: 1px solid var(--brand-accent);">${tObj.btn_tributo_tri || 'Tributo al TRI'}</a>
                <a href="https://www.youtube.com/shorts/O_xHWoePOpY" target="_blank" style="display: block; width: 100%; box-sizing: border-box; background: #000; color: #fff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 0.85rem; text-align: center; border: 1px solid var(--brand-accent);">${tObj.btn_junto_mar || 'Junto al Mar'}</a>
                <a href="https://www.youtube.com/shorts/F6eVDMPTGvI" target="_blank" style="display: block; width: 100%; box-sizing: border-box; background: #000; color: #fff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 0.85rem; text-align: center; border: 1px solid var(--brand-accent);">${tObj.btn_con_gente || 'Con mi gente'}</a>
                <a href="https://www.youtube.com/shorts/ei819k9iXmg" target="_blank" style="display: block; width: 100%; box-sizing: border-box; background: #000; color: #fff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 0.85rem; text-align: center; border: 1px solid var(--brand-accent);">${tObj.btn_cantando_beatles || 'Cantando a The beatles'}</a>
            `;
        } else if (cat === 'cat2') {
            const lang = localStorage.getItem('selectedLanguage') || 'es';
            const tObj = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : {};
            
            videoContainer.innerHTML = `
                <a href="https://www.youtube.com/shorts/Bm5BiSfe0Hk" target="_blank" style="display: block; width: 100%; box-sizing: border-box; background: #b00; color: #fff; padding: 14px 25px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 0.9rem; text-align: center;">
                    ${tObj.btn_video_historia || 'VIDEO DE MI HISTORIA'}
                </a>
            `;
        }
        grid.appendChild(videoContainer);
    }
    
    const btn = document.createElement('button');
    btn.className = 'btn-details-gold'; 
    btn.innerHTML = `<i class="fas fa-plus-circle"></i> VER DETALLES`;
    btn.onclick = (e) => { e.stopPropagation(); openTextZoom(cat); };
    grid.appendChild(btn);
}

function createPol(src, pos, arr) {
    const div = document.createElement('div');
    div.className = `polaroid-item ${pos}`;
    div.innerHTML = `<img src="${src}">`;
    div.onclick = (e) => { e.stopPropagation(); openLightbox(src, arr, false); };
    return div;
}

function openLightbox(src, arr, hideControls) {
    playClick();
    currentGallery = arr;
    currentIndex = arr.indexOf(src);
    const lightboxEl = document.getElementById('lightbox');
    const imgEl = document.getElementById('lightbox-image');
    if(hideControls) { lightboxEl.classList.add('hide-nav-arrows'); } else { lightboxEl.classList.remove('hide-nav-arrows'); }
    imgEl.src = src;
    lightboxEl.style.display = 'flex';
}

function changeLightboxImage(dir) {
    if(currentGallery.length <= 1) return;
    playClick();
    currentIndex = (currentIndex + dir + currentGallery.length) % currentGallery.length;
    document.getElementById('lightbox-image').src = currentGallery[currentIndex];
}

function openTextZoom(cat) {
    playClick();
    document.getElementById('text-zoom-title').innerText = CONFIG.textos[cat].t;
    document.getElementById('text-zoom-content').innerText = CONFIG.textos[cat].c;
    document.getElementById('text-zoom-modal').style.display = 'flex';
}

function closeLightbox() { document.getElementById('lightbox').style.display = 'none'; }
function closeAppContent() { document.getElementById('dynamic-content-layer').style.display = 'none'; }
function closeTextZoom() { document.getElementById('text-zoom-modal').style.display = 'none'; }
function openBrandModal(modalId) { playClick(); const modal = document.getElementById(modalId); if (modal) modal.style.display = 'flex'; }

function closeBrandModal(modalId) { const modal = document.getElementById(modalId); if (modal) modal.style.display = 'none'; }
function playClickSound() { playClick(); }

function toggleAudioGlobal() {
    isMuted = !isMuted;
    const spot = document.getElementById('spot-intro');
    const icon = document.getElementById('audio-icon');
    spot.muted = isMuted;
    icon.className = isMuted ? "fas fa-volume-mute" : "fas fa-volume-up";
}

function playClick() { const snd = document.getElementById('sndFxClick'); if(snd && !isMuted) { snd.currentTime = 0; snd.play().catch(()=>{}); } }
function openNetworkCard(url) { playClick(); window.open(url, '_blank'); }

// LÓGICA DE ACORDEÓN PARA EL MENÚ DE CONTACTO DE SUCURSALES
function abrirMenu() {
    playClick();
    document.getElementById('miMenuContacto').style.display = 'flex';
}

function cerrarMenu() {
    document.getElementById('miMenuContacto').style.display = 'none';
    // Colapsar todos los acordeones al cerrar el menú
    document.querySelectorAll('.sucursal-panel-content').forEach(panel => panel.style.display = 'none');
}

function toggleSucursalAcordeon(sucKey) {
    playClick();
    const panel = document.getElementById(`${sucKey}-panel`);
    const estaVisible = panel.style.display === 'flex';
    
    // Ocultar todos los paneles primero
    document.querySelectorAll('.sucursal-panel-content').forEach(p => p.style.display = 'none');
    
    // Si no estaba visible, lo mostramos
    if (!estaVisible) {
        panel.style.display = 'flex';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('click', () => {
        const spot = document.getElementById('spot-intro');
        if(spot && !isMuted) spot.play().catch(()=>{});
    }, {once: true});
});

async function shareExperienceRobust() {
    try { await navigator.share({ title: 'Lonchería Magaña', url: window.location.href }); }
    catch { playClick(); navigator.clipboard.writeText(window.location.href).then(() => { alert("¡Enlace copiado al portapapeles!"); }); }
}