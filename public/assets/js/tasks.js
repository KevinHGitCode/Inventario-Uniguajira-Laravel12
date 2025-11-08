function initFormsTask() {
    // Para crear tareas
    inicializarFormularioAjax('#taskForm', {
        onBefore: (form, config) => {
            const taskName = document.getElementById('taskName').value.trim();
            if (!taskName) {
                showNotification('El nombre de la tarea es requerido', 'error');
                return false; // Cancelar envío
            }
        },
        closeModalOnSuccess: true,
        resetOnSuccess: true,
        onSuccess: (data) => {
            loadContent('/home');
            showNotification('Tarea creada exitosamente', 'success');
        }
    });

    // Para actualizar tareas
    inicializarFormularioAjax('#editTaskForm', {
        contentType: 'application/json',
        customBody: (form) => {
            return {
                id: document.getElementById('editTaskId').value,
                name: document.getElementById('editTaskName').value,
                description: document.getElementById('editTaskDesc').value,
                date: document.getElementById('editTaskDate').value
            };
        },
        closeModalOnSuccess: true,
        onSuccess: (data) => {
            loadContent('/home');
            showNotification('Tarea actualizada exitosamente', 'success');
        }
    });
}

function btnEditTask(id, name, description, date) {
    document.getElementById('editTaskId').value = id;
    document.getElementById('editTaskName').value = decodeURIComponent(name);
    document.getElementById('editTaskDesc').value = decodeURIComponent(description);
    // Convert date to YYYY-MM-DD format for input type="date"
    const formattedDate = new Date(date).toISOString().split('T')[0];
    console.log(formattedDate)
    document.getElementById('editTaskDate').value = formattedDate;
    
    mostrarModal('#editTaskModal');
}

function toggleTask(taskId, button) {
    fetch('/api/tasks/toggle', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ id: taskId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const taskCard = button.closest('.task-card');
            taskCard.classList.toggle('completed');
            button.classList.toggle('completed');
            moveTaskToProperSection(taskCard);
            showNotification('Estado de tarea actualizado', 'success');
        } else {
            throw new Error(data.error || 'Error al actualizar el estado de la tarea');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification(error.message, 'error');
    });
}

function deleteTask(taskId) {
    eliminarRegistro({
        url: `/api/tasks/delete/${taskId}`,
        onSuccess: (response) => {
            if (response.success) 
                loadContent('/home', false);
            showToast(response);
        }
    });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

function createEmptyMessage(type = 'pending') {
    const container = document.createElement('div');
    container.className = 'no-tasks-message';
    
    const icon = document.createElement('i');
    icon.className = type === 'pending' ? 
        'fas fa-clipboard-list fa-3x' : 
        'fas fa-folder-open fa-3x';
    icon.style.opacity = '0.6';
    icon.style.color = '#888';
    
    const text = document.createElement('p');
    text.textContent = type === 'pending' ? 
        'No tienes tareas pendientes.' : 
        'No tienes tareas completadas.';
    
    container.appendChild(icon);
    container.appendChild(text);
    return container;
}

function moveTaskToProperSection(taskCard) {
    const isCompleted = taskCard.classList.contains('completed');
    const pendingContainer = document.querySelector('.tasks-flex:not(.completed-tasks)');
    const completedContainer = document.querySelector('.completed-tasks');

    // Remove existing empty state messages if they exist
    ['pending', 'completed'].forEach(type => {
        const container = type === 'pending' ? pendingContainer : completedContainer;
        const message = container.querySelector('.no-tasks-message');
        if (message) message.remove();
    });

    // Move the task to the appropriate container
    const targetContainer = isCompleted ? completedContainer : pendingContainer;
    const sourceContainer = isCompleted ? pendingContainer : completedContainer;
    targetContainer.appendChild(taskCard);

    // Check and update empty states
    if (sourceContainer.children.length === 0) {
        sourceContainer.appendChild(
            createEmptyMessage(isCompleted ? 'pending' : 'completed')
        );
    }
}

function toggleCompletedTasks() {
    const completedTasksSection = document.querySelector('.completed-tasks');
    const arrow = document.getElementById('completedTasksArrow');
    if (completedTasksSection && arrow) {
        completedTasksSection.classList.toggle('collapsed');
        arrow.classList.toggle('rotated');
    }
}