function parseItalicText(text) {
    return text.replace(/\*([^*]+)\*/g, '<i>$1</i>');
}

function populateTitleSection(data) {
    const directionIcon = document.getElementById('direction-icon');
    const directionText = document.getElementById('direction-text');
    const mainTitle = document.getElementById('main-title');
    const goalValue = document.getElementById('goal-value');
    
    if (data.direction === 'higher') {
        directionIcon.innerHTML = '<i class="fa-solid fa-circle-arrow-up fa-xl"></i>';
        directionText.textContent = 'Increase';
    } else {
        directionIcon.innerHTML = '<i class="fa-solid fa-circle-arrow-down fa-xl"></i>';
        directionText.textContent = 'Reduce';
    }
    
    if (data.title && data.details) {
        if (data.subtitle) {
            mainTitle.innerHTML = `<span class="title-main">${data.title}</span>
                                   <span class="title-details">${data.details}</span>
                                   <span class="subtitle">${data.subtitle}</span>`;
        } else {
            mainTitle.innerHTML = `<span class="title-main">${data.title}</span>
                                   <span class="title-details">${data.details}</span>`;
        }
    }
    else if (data.title) {
        if (data.subtitle) {
            mainTitle.innerHTML = `<span class="title-main">${data.title}</span>
                                   <span class="subtitle">${data.subtitle}</span>`;
        } else {
            mainTitle.innerHTML = `<span class="title-main">${data.title}</span>`;
        }
    }
    
    goalValue.textContent = data.goal.toFixed(1) + (data.rateUnit || '');
}

function initializeTitleSection(data) {
    document.addEventListener('DOMContentLoaded', () => {
        populateTitleSection(data);
    });
}
