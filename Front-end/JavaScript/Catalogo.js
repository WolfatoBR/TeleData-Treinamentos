const courses = [
    {
        id: 1,
        title: "Curso Elementor Wordpress: Criando Sites com Elementor",
        description: "Aprenda a construir sites e páginas de vendas utilizando um dos mais populares plugins de WordPress no mundo!",
        instructor: "Rafael Santos",
        rating: 4.4,
        reviews: 3942,
        students: "9 horas de vídeo",
        duration: 540,
        price: "R$ 26,90",
        oldPrice: "R$ 89,90",
        imageClass: "purple",
        imageType: "elementor",
        bestseller: true,
        mostSold: false,
        topics: ["WordPress", "Elementor"],
        isFree: false
    },
    {
        id: 2,
        title: "Crie Apps Incríveis sem digitar código c/ FlutterFlow - 2023",
        description: "Desenvolva aplicativos profissionais sem precisar ser um expert em programação com o curso de Low-Code FlutterFlow",
        instructor: "Premium Label",
        rating: 4.7,
        reviews: 1837,
        students: "9.5 horas de vídeo",
        duration: 570,
        price: "R$ 27,90",
        oldPrice: "R$ 79,90",
        imageClass: "blue",
        imageType: "flutter",
        bestseller: false,
        mostSold: false,
        topics: ["Programação visual", "FlutterFlow"],
        isFree: false
    },
    {
        id: 3,
        title: "Curso WordPress - Do Básico ao Avançado",
        description: "Tudo sobre WordPress ✓ Hospedagem ✓ Elementor ✓ 6 Projetos Reais",
        instructor: "André Neves",
        rating: 4.7,
        reviews: 888,
        students: "20 horas de vídeo",
        duration: 1200,
        price: "R$ 27,90",
        oldPrice: "R$ 89,90",
        imageClass: "dark",
        imageType: "wordpress",
        bestseller: true,
        mostSold: true,
        topics: ["WordPress"],
        isFree: false
    },
    {
        id: 4,
        title: "Curso Elementor Wordpress: Criando Sites com Elementor",
        description: "Aprenda a construir sites e páginas de vendas utilizando um dos mais populares plugins de WordPress no mundo!",
        instructor: "Rafael Santos",
        rating: 4.4,
        reviews: 3942,
        students: "9 horas de vídeo",
        duration: 540,
        price: "R$ 26,90",
        oldPrice: "R$ 89,90",
        imageClass: "purple",
        imageType: "elementor",
        bestseller: true,
        mostSold: false,
        topics: ["WordPress", "Elementor"],
        isFree: false
    },
    {
        id: 5,
        title: "Crie Apps Incríveis sem digitar código c/ FlutterFlow - 2023",
        description: "Desenvolva aplicativos profissionais sem precisar ser um expert em programação com o curso de Low-Code FlutterFlow",
        instructor: "Premium Label",
        rating: 4.7,
        reviews: 1837,
        students: "9.5 horas de vídeo",
        duration: 570,
        price: "R$ 27,90",
        oldPrice: "R$ 79,90",
        imageClass: "blue",
        imageType: "flutter",
        bestseller: false,
        mostSold: false,
        topics: ["Programação visual", "FlutterFlow"],
        isFree: false
    }
];

function getImageContent(imageType) {
    if (imageType === 'elementor') {
        return `
            <div class="course-image-content">
                <div class="image-icon">E</div>
                <div class="image-icon circle">
                    <div class="image-icon-inner"></div>
                </div>
            </div>
        `;
    } else if (imageType === 'flutter') {
        return `
            <div class="course-image-content">
                <div style="font-size: 48px;">📱</div>
                <div class="image-icon circle">
                    <div class="image-icon-inner"></div>
                </div>
                <div style="font-size: 48px;">🎨</div>
            </div>
        `;
    } else {
        return `
            <div class="image-icon circle">
                <div class="image-icon-inner"></div>
            </div>
        `;
    }
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="star${i <= Math.floor(rating) ? '' : ' empty'}">★</span>`;
    }
    return stars;
}

function renderCourses(coursesToRender) {
    const coursesList = document.getElementById('coursesList');
    coursesList.innerHTML = '';

    coursesToRender.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <div class="course-image ${course.imageClass}">
                ${getImageContent(course.imageType)}
            </div>
            <div class="course-info">
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <p class="course-instructor">${course.instructor}</p>
                <div class="course-rating">
                    <span class="rating-number">${course.rating}</span>
                    <span class="stars">${renderStars(course.rating)}</span>
                    <span class="rating-count">(${course.reviews.toLocaleString()})</span>
                </div>
                <div class="course-meta">
                    <span>${course.students}</span>
                    <span>•</span>
                    <span>Todas as aulas</span>
                </div>
                <div class="course-badges">
                    ${course.bestseller ? '<span class="badge bestseller">⚡ Bestseller</span>' : ''}
                    ${course.mostSold ? '<span class="badge most-sold">Mais vendido</span>' : ''}
                </div>
            </div>
            <div class="course-price">
                <div class="price-current">${course.price}</div>
                <div class="price-old">${course.oldPrice}</div>
            </div>
        `;
        coursesList.appendChild(courseCard);
    });

    document.getElementById('resultsCount').textContent = coursesToRender.length === courses.length ? '1,938' : coursesToRender.length;
}

function applyFilters() {
    const selectedRating = document.querySelector('input[name="rating"]:checked');
    const selectedDuration = document.querySelector('input[name="duration"]:checked');
    const selectedTopics = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    const selectedPrice = document.querySelector('input[name="price"]:checked');

    let filteredCourses = courses.filter(course => {
        if (selectedRating && course.rating < parseFloat(selectedRating.value)) return false;
        if (selectedDuration && course.duration < parseInt(selectedDuration.value)) return false;
        if (selectedTopics.length > 0 && !selectedTopics.some(topic => course.topics.includes(topic))) return false;
        if (selectedPrice) {
            if (selectedPrice.value === 'free' && !course.isFree) return false;
            if (selectedPrice.value === 'paid' && course.isFree) return false;
        }
        return true;
    });

    renderCourses(filteredCourses);
}

function clearFilters() {
    document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
    document.querySelectorAll('input[type="checkbox"]').forEach(input => input.checked = false);
    renderCourses(courses);
}

// Renderizar cursos inicialmente
renderCourses(courses);