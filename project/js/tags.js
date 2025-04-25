// Tags management functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu toggle
    initializeMenuToggle();

    // Tag management
    const tagForm = document.getElementById('tagForm');
    const tagList = document.getElementById('tagList');
    const colorPicker = document.getElementById('colorPicker');
    const tagNameInput = document.getElementById('tagName');
    const tagColorInput = document.getElementById('tagColor');
    const tagDescriptionInput = document.getElementById('tagDescription');
    const tagCount = document.getElementById('tagCount');
    const tagColorPreview = document.getElementById('tagColorPreview');

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

    // Initialize color picker
    if (colorPicker) {
        colorPicker.addEventListener('input', function() {
            const color = this.value;
            tagColorInput.value = color;
            tagColorPreview.className = `tag-color-preview ${getColorClass(color)}`;
        });
    }

    // Load tags from localStorage
    let tags = JSON.parse(localStorage.getItem('tags')) || [];

    // Update tag count
    function updateTagCount() {
        tagCount.textContent = tags.length;
    }

    // Save tags to localStorage
    function saveTags() {
        localStorage.setItem('tags', JSON.stringify(tags));
        updateTagCount();
    }

    // Render tags
    function renderTags() {
        tagList.innerHTML = '';
        tags.forEach((tag, index) => {
            const tagElement = createTagElement(tag);
            tagList.appendChild(tagElement);
        });
    }

    // Add new tag
    if (tagForm) {
        tagForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = tagNameInput.value.trim();
            const color = tagColorInput.value;
            const description = tagDescriptionInput.value.trim();

            if (name) {
                const newTag = {
                    name,
                    color,
                    description
                };

                tags.push(newTag);
                saveTags();
                renderTags();

                // Reset form
                tagForm.reset();
                tagColorPreview.className = 'tag-color-preview tag-color-default';
            }
        });
    }

    // Initial render
    updateTagCount();
    renderTags();
}); 