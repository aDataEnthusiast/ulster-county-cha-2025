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
    
    mainTitle.textContent = data.title;
    goalValue.textContent = data.goal.toFixed(1) + (data.rateUnit || '');
}

function initializeTitleSection(data) {
    document.addEventListener('DOMContentLoaded', () => {
        populateTitleSection(data);
    });
}
