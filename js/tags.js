// Tags management functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu toggle
    initializeMenuToggle();

    // Tag management
    const tagForm = document.getElementById('tagForm');
    const tagList = document.getElementById('tagsContainer');
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
        if (tagCount) {
            tagCount.textContent = tags.length;
        }
    }

    // Save tags to localStorage
    function saveTags() {
        localStorage.setItem('tags', JSON.stringify(tags));
        updateTagCount();
    }

    // Create tag element
    function createTagElement(tag, index) {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag-item';
        tagElement.innerHTML = `
            <div class="tag-header">
                <span class="tag-color ${getColorClass(tag.color)}"></span>
                <span class="tag-name">${tag.name}</span>
                <button class="tag-delete" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            ${tag.description ? `<p class="tag-description">${tag.description}</p>` : ''}
            <div class="tag-actions">
                <button class="btn btn-edit" data-index="${index}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-delete" data-index="${index}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;

        // Add event listeners for buttons
        const deleteBtn = tagElement.querySelector('.tag-delete');
        const editBtn = tagElement.querySelector('.btn-edit');
        const deleteConfirmBtn = tagElement.querySelector('.btn-delete');

        deleteBtn.addEventListener('click', () => {
            tags.splice(index, 1);
            saveTags();
            renderTags();
        });

        editBtn.addEventListener('click', () => {
            tagNameInput.value = tag.name;
            tagColorInput.value = tag.color;
            tagDescriptionInput.value = tag.description || '';
            colorPicker.value = tag.color;
            tagColorPreview.className = `tag-color-preview ${getColorClass(tag.color)}`;
            
            tags.splice(index, 1);
            saveTags();
            renderTags();
        });

        deleteConfirmBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this tag?')) {
                tags.splice(index, 1);
                saveTags();
                renderTags();
            }
        });

        return tagElement;
    }

    // Render tags
    function renderTags() {
        if (tagList) {
            tagList.innerHTML = '';
            tags.forEach((tag, index) => {
                const tagElement = createTagElement(tag, index);
                tagList.appendChild(tagElement);
            });
        }
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