// Task Management Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get the form and task list elements
    const addTaskForm = document.querySelector('.add-task-form');
    const taskList = document.querySelector('.task-list');
    const taskInput = document.querySelector('.task-input');

    // Only proceed if we're on a page with task functionality
    if (addTaskForm && taskList && taskInput) {
        // Check for task in URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const taskFromUrl = urlParams.get('task');
        
        if (taskFromUrl) {
            // Create task item from URL parameter
            createTaskItem(taskFromUrl);
            // Clear the URL parameter
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Add new task
        addTaskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const taskText = taskInput.value.trim();
            if (!taskText) return;

            createTaskItem(taskText);
            
            // Clear input
            taskInput.value = '';
            
            // Save tasks to localStorage
            saveTasks();
        });

        // Handle task completion
        taskList.addEventListener('change', function(e) {
            if (e.target.classList.contains('task-checkbox')) {
                const taskItem = e.target.closest('.task-item');
                taskItem.classList.toggle('completed', e.target.checked);
                saveTasks();
            }
        });

        // Function to create a task item
        function createTaskItem(taskText) {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            
            const taskTextElement = document.createElement('span');
            taskTextElement.className = 'task-text';
            taskTextElement.textContent = taskText;
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-task';
            deleteButton.textContent = '×';
            deleteButton.onclick = function() {
                taskItem.remove();
                saveTasks();
            };
            
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskTextElement);
            taskItem.appendChild(deleteButton);
            
            taskList.appendChild(taskItem);
        }

        // Save tasks to localStorage
        function saveTasks() {
            const tasks = Array.from(taskList.children).map(taskItem => ({
                text: taskItem.querySelector('.task-text').textContent,
                completed: taskItem.querySelector('.task-checkbox').checked
            }));
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        // Load tasks when page loads
        function loadTasks() {
            const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            savedTasks.forEach(task => {
                createTaskItem(task.text);
                const taskItem = taskList.lastChild;
                if (task.completed) {
                    taskItem.classList.add('completed');
                    taskItem.querySelector('.task-checkbox').checked = true;
                }
            });
        }

        // Load tasks when page loads
        loadTasks();
    }
}); 

const modal = document.getElementById('editTaskModal');
const closeModal = document.querySelector('.close-modal');
const editTaskForm = document.getElementById('editTaskForm');

// Modify the task structure in your add task function
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const taskText = document.getElementById('taskInput').value.trim();
    const taskTagValue = document.getElementById('taskTag').value;

    if (taskText) {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            tag: taskTagValue,
            completed: false,
            dueDate: null // Add this new field
        };

        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        taskForm.reset();
        loadTasks();
    }
});

// Add edit task function
window.editTask = function(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        document.getElementById('editTaskId').value = task.id;
        document.getElementById('editTaskText').value = task.text;
        document.getElementById('editTaskTag').value = task.tag || '';
        document.getElementById('editTaskDueDate').value = task.dueDate || '';
        
        // Show modal
        modal.style.display = 'block';
    }
};

// Close modal when clicking the close button or outside the modal
closeModal.onclick = function() {
    modal.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Handle edit form submission
editTaskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const taskId = document.getElementById('editTaskId').value;
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            text: document.getElementById('editTaskText').value,
            tag: document.getElementById('editTaskTag').value,
            dueDate: document.getElementById('editTaskDueDate').value
        };
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
        modal.style.display = 'none';
    }
});

// Modify loadTasks function to display due dates
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const tags = JSON.parse(localStorage.getItem('tags') || '[]');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        
        const tag = tags.find(t => t.name === task.tag);
        const tagHtml = tag ? 
            `<span class="task-tag ${getColorClass(tag.color)}">${tag.name}</span>` : '';
        
        const dueDateHtml = task.dueDate ? 
            `<span class="task-due-date">${new Date(task.dueDate).toLocaleDateString()}</span>` : '';

        taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            ${tagHtml}
            ${dueDateHtml}
            <button class="task-edit" onclick="window.editTask('${task.id}')">
                <i class="fa-solid fa-edit"></i>
            </button>
            <button class="task-delete" onclick="window.deleteTask('${task.id}')">&times;</button>
        `;

        const checkbox = taskElement.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => window.toggleTask(task.id));

        taskList.appendChild(taskElement);
    });
}