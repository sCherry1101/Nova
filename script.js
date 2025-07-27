document.addEventListener('DOMContentLoaded', () => {
    const newQuestInput = document.getElementById('new-quest-input');
    const questCategoryInput = document.getElementById('quest-category-input');
    const questPriorityInput = document.getElementById('quest-priority-input');
    const questDueDateInput = document.getElementById('quest-due-date-input');
    const questRewardInput = document.getElementById('quest-reward-input');
    const addQuestBtn = document.getElementById('add-quest-btn');
    const questList = document.getElementById('quest-list');
    const totalXpSpan = document.getElementById('total-xp');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');

    let questsData = [];
    const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };

    function saveQuests() {
        localStorage.setItem('novaQuests', JSON.stringify(questsData));
        updateTotalXp();
    }

    function loadQuests() {
        const storedQuests = JSON.parse(localStorage.getItem('novaQuests'));
        if (storedQuests) {
            questsData = storedQuests;
            renderQuests();
        }
        updateTotalXp();
    }

    function updateTotalXp() {
        let currentXp = 0;
        questsData.forEach(quest => {
            if (quest.completed) {
                currentXp += quest.reward;
            }
        });
        totalXpSpan.textContent = currentXp;
    }

    function showThumbsUpPopup(questItem) {
        const popup = document.createElement('div');
        popup.textContent = '👍';
        popup.classList.add('thumbs-up-popup');

        const rect = questItem.getBoundingClientRect();
        popup.style.left = `${rect.left + rect.width / 2}px`;
        popup.style.top = `${rect.top + rect.height / 2}px`;

        document.body.appendChild(popup);

        requestAnimationFrame(() => {
            popup.classList.add('active');
        });

        setTimeout(() => {
            popup.classList.remove('active');
            popup.addEventListener('transitionend', () => popup.remove(), { once: true });
        }, 1000);
    }

    function createQuestElement(quest) {
        const listItem = document.createElement('li');
        listItem.classList.add('quest-item');
        if (quest.completed) {
            listItem.classList.add('completed');
        }

        const questDetails = document.createElement('div');
        questDetails.classList.add('quest-details');

        const span = document.createElement('span');
        span.classList.add('quest-text');
        span.textContent = quest.text;
        span.setAttribute('contenteditable', 'false');

        const metaInfo = document.createElement('div');
        metaInfo.classList.add('quest-meta');

        if (quest.category) {
            const categorySpan = document.createElement('span');
            categorySpan.classList.add('quest-category');
            categorySpan.textContent = `Category: ${quest.category}`;
            metaInfo.appendChild(categorySpan);
        }

        const prioritySpan = document.createElement('span');
        prioritySpan.classList.add('quest-priority', `priority-${quest.priority}`);
        prioritySpan.textContent = `Priority: ${quest.priority.charAt(0).toUpperCase() + quest.priority.slice(1)}`;
        metaInfo.appendChild(prioritySpan);

        if (quest.dueDate) {
            const dueDateSpan = document.createElement('span');
            dueDateSpan.classList.add('quest-due-date');
            dueDateSpan.textContent = `Due: ${quest.dueDate}`;
            metaInfo.appendChild(dueDateSpan);
        }

        const rewardSpan = document.createElement('span');
        rewardSpan.classList.add('quest-reward');
        rewardSpan.textContent = `XP: ${quest.reward}`;
        metaInfo.appendChild(rewardSpan);

        questDetails.appendChild(span);
        questDetails.appendChild(metaInfo);

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');

        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.textContent = 'Edit';

        const completeBtn = document.createElement('button');
        completeBtn.classList.add('complete-btn');
        completeBtn.textContent = quest.completed ? 'Undo' : 'Complete';

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';

        completeBtn.addEventListener('click', () => {
            quest.completed = !quest.completed;
            if (quest.completed) {
                listItem.classList.add('completed');
                completeBtn.textContent = 'Undo';
                editBtn.style.display = 'none';
                if (span.contentEditable === 'true') {
                    span.contentEditable = 'false';
                    span.classList.remove('editing');
                    editBtn.textContent = 'Edit';
                    span.textContent = span.textContent.trim();
                }
                showThumbsUpPopup(listItem);
            } else {
                listItem.classList.remove('completed');
                completeBtn.textContent = 'Complete';
                editBtn.style.display = 'inline-block';
            }
            saveQuests();
        });

        editBtn.addEventListener('click', () => {
            if (span.contentEditable === 'true') {
                span.contentEditable = 'false';
                span.classList.remove('editing');
                editBtn.textContent = 'Edit';
                quest.text = span.textContent.trim();

                if (quest.text === '') {
                    const index = questsData.indexOf(quest);
                    if (index > -1) {
                        questsData.splice(index, 1);
                    }
                    listItem.classList.add('removing');
                    listItem.addEventListener('transitionend', () => listItem.remove());
                }
                saveQuests();
            } else {
                span.contentEditable = 'true';
                span.classList.add('editing');
                editBtn.textContent = 'Save';
                span.focus();
                const range = document.createRange();
                range.selectNodeContents(span);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });

        span.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                span.contentEditable = 'false';
                span.classList.remove('editing');
                editBtn.textContent = 'Edit';
                quest.text = span.textContent.trim();
                span.blur();

                if (quest.text === '') {
                    const index = questsData.indexOf(quest);
                    if (index > -1) {
                        questsData.splice(index, 1);
                    }
                    listItem.classList.add('removing');
                    listItem.addEventListener('transitionend', () => listItem.remove());
                }
                saveQuests();
            }
        });

        span.addEventListener('blur', () => {
            if (span.contentEditable === 'true' && editBtn.textContent === 'Save') {
                span.contentEditable = 'false';
                span.classList.remove('editing');
                editBtn.textContent = 'Edit';
                quest.text = span.textContent.trim();

                if (quest.text === '') {
                    const index = questsData.indexOf(quest);
                    if (index > -1) {
                        questsData.splice(index, 1);
                    }
                    listItem.classList.add('removing');
                    listItem.addEventListener('transitionend', () => listItem.remove());
                }
                saveQuests();
            }
        });

        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this quest?')) {
                const index = questsData.indexOf(quest);
                if (index > -1) {
                    questsData.splice(index, 1);
                }
                listItem.classList.add('removing');
                listItem.addEventListener('transitionend', () => {
                    listItem.remove();
                    saveQuests();
                });
            }
        });

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(completeBtn);
        actionsDiv.appendChild(deleteBtn);

        listItem.appendChild(questDetails);
        listItem.appendChild(actionsDiv);

        if (quest.completed) {
            editBtn.style.display = 'none';
        }

        return listItem;
    }

    function renderQuests() {
        questList.innerHTML = '';
        let filteredQuests = questsData;

        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredQuests = filteredQuests.filter(quest =>
                quest.text.toLowerCase().includes(searchTerm) ||
                (quest.category && quest.category.toLowerCase().includes(searchTerm))
            );
        }

        const sortBy = sortSelect.value;
        filteredQuests.sort((a, b) => {
            if (sortBy === 'priority-desc') {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            } else if (sortBy === 'priority-asc') {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            } else if (sortBy === 'dueDate-asc') {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            } else if (sortBy === 'dueDate-desc') {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(b.dueDate) - new Date(a.dueDate);
            } else if (sortBy === 'xp-desc') {
                return b.reward - a.reward;
            } else if (sortBy === 'xp-asc') {
                return a.reward - b.reward;
            } else if (sortBy === 'completed') {
                return (a.completed === b.completed) ? 0 : a.completed ? 1 : -1;
            }
            return 0;
        });

        filteredQuests.forEach(quest => {
            questList.appendChild(createQuestElement(quest));
        });
    }

    function addQuestHandler() {
        const questText = newQuestInput.value.trim();
        const questCategory = questCategoryInput.value.trim();
        const questPriority = questPriorityInput.value;
        const questDueDate = questDueDateInput.value;
        const questReward = parseInt(questRewardInput.value) || 0;

        if (questText === '') {
            newQuestInput.placeholder = "Quest cannot be empty!";
            newQuestInput.classList.add('error-pulse');
            setTimeout(() => {
                newQuestInput.placeholder = "Add a new quest...";
                newQuestInput.classList.remove('error-pulse');
            }, 1000);
            return;
        }

        const newQuest = {
            id: Date.now(),
            text: questText,
            category: questCategory,
            priority: questPriority,
            dueDate: questDueDate,
            reward: questReward,
            completed: false
        };

        questsData.push(newQuest);
        renderQuests();
        saveQuests();

        newQuestInput.value = '';
        questCategoryInput.value = '';
        questPriorityInput.value = 'low';
        questDueDateInput.value = '';
        questRewardInput.value = '100';
        newQuestInput.focus();
    }

    addQuestBtn.addEventListener('click', addQuestHandler);

    newQuestInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addQuestHandler();
        }
    });

    searchInput.addEventListener('input', renderQuests);
    sortSelect.addEventListener('change', renderQuests);

    loadQuests();
});
