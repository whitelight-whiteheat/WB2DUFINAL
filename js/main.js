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