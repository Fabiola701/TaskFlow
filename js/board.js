// Task board interactions: drag cards or use each card's status menu.
(() => {
  const storageKey = 'taskflow_board_status';
  const columns = [...document.querySelectorAll('.board-column[data-status]')];
  const allowedStatuses = new Set(columns.map(column => column.dataset.status));
  const announcement = document.getElementById('board-announcement');
  let saved = {};

  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) saved = parsed;
  } catch { /* Ignore invalid or unavailable saved data. */ }

  const save = () => {
    const positions = {};
    document.querySelectorAll('.task-card[data-task-id]').forEach(card => {
      positions[card.dataset.taskId] = card.closest('.board-column').dataset.status;
    });
    try { localStorage.setItem(storageKey, JSON.stringify(positions)); } catch { /* The board still works for this visit. */ }
  };

  const updateCounts = () => columns.forEach(column => {
    const heading = column.querySelector('h2');
    const cards = column.querySelectorAll('.task-card');
    let count = heading.querySelector('.board-count');
    if (!count) {
      count = document.createElement('span');
      count.className = 'board-count badge rounded-pill ms-2';
      heading.append(count);
    }
    count.textContent = cards.length;
  });

  const moveCard = (card, destination, announce = true) => {
    if (!card || !allowedStatuses.has(destination)) return;
    const column = columns.find(item => item.dataset.status === destination);
    if (!column) return;
    const title = card.querySelector('h3')?.textContent.trim() || 'Task';
    column.insertBefore(card, column.querySelector('.btn'));
    const select = card.querySelector('.task-status-select');
    if (select) select.value = destination;
    updateCounts();
    save();
    if (announce && announcement) announcement.textContent = `${title} moved to ${column.querySelector('h2').childNodes[0].textContent.trim()}.`;
  };

  document.querySelectorAll('.board-column').forEach(column => {
    column.querySelectorAll('.task-card').forEach(card => {
      const title = card.querySelector('h3')?.textContent.trim() || 'task';
      card.dataset.taskId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      card.draggable = true;
      card.tabIndex = 0;
      card.setAttribute('aria-label', `${title}. Drag to change status, or use the status menu.`);

      const label = document.createElement('label');
      label.className = 'task-status-control';
      const labelText = document.createElement('span');
      labelText.textContent = 'Move to';
      labelText.className = 'visually-hidden';
      const select = document.createElement('select');
      select.className = 'form-select form-select-sm task-status-select';
      select.setAttribute('aria-label', `Move ${title} to another status`);
      columns.forEach(target => {
        const option = document.createElement('option');
        option.value = target.dataset.status;
        option.textContent = target.querySelector('h2').childNodes[0].textContent.trim();
        select.append(option);
      });
      label.append(labelText, select);
      card.append(label);
      select.addEventListener('change', () => moveCard(card, select.value));
    });
  });

  // Restore only valid saved statuses for cards that still exist.
  document.querySelectorAll('.task-card[data-task-id]').forEach(card => {
    const status = saved[card.dataset.taskId];
    if (allowedStatuses.has(status)) moveCard(card, status, false);
  });

  let draggedCard = null;
  document.querySelectorAll('.task-card').forEach(card => {
    card.addEventListener('dragstart', event => {
      draggedCard = card;
      card.classList.add('is-dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', card.dataset.taskId);
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('is-dragging');
      columns.forEach(column => column.classList.remove('is-over'));
      draggedCard = null;
    });
  });
  columns.forEach(column => {
    column.addEventListener('dragover', event => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      column.classList.add('is-over');
    });
    column.addEventListener('dragleave', event => {
      if (!column.contains(event.relatedTarget)) column.classList.remove('is-over');
    });
    column.addEventListener('drop', event => {
      event.preventDefault();
      column.classList.remove('is-over');
      if (draggedCard) moveCard(draggedCard, column.dataset.status);
    });
  });
  updateCounts();
})();
