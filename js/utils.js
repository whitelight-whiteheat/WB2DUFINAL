// Common utility functions
function initializeMenuToggle() {
    document.querySelector('.menu-toggle').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
    });
}

// Helper function to map color values to predefined classes
function getColorClass(color) {
    const colorMap = {
        '#e9ecef': 'tag-color-default',
        '#d1ecf1': 'tag-color-primary',
        '#d4edda': 'tag-color-success',
        '#fff3cd': 'tag-color-warning',
        '#f8d7da': 'tag-color-danger',
        '#cce5ff': 'tag-color-info',
        '#e2e3e5': 'tag-color-secondary',
        '#fefefe': 'tag-color-light',
        '#d6d8d9': 'tag-color-dark'
    };
    return colorMap[color.toLowerCase()] || 'tag-color-default';
}

// Create tag element
function createTagElement(tag) {
    const span = document.createElement('span');
    span.className = 'tag-item';
    
    // Map color values to predefined classes
    const colorClass = getColorClass(tag.color);
    span.classList.add(colorClass);
    
    span.textContent = tag.name;
    return span;
} 