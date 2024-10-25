const getTasksFromLocalStorage = () => {
    const localTasks = JSON.parse(window.localStorage.getItem('tasks'))
    return localTasks ? localTasks : []
}

const setTasksInLocalStorage = (tasks) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks))
}

const tasksCounter = (tasks) =>{
    const doneTasks = tasks.filter(({ checked }) => checked).length
    const totalTasks = tasks.length

    document.getElementById('done-counter').innerText = `${doneTasks}/${totalTasks} Concluídas`
}

const removeTask = (taskId) => {
    const tasks = getTasksFromLocalStorage()
    const updatedTasks = tasks.filter(({ id }) => parseInt(id) !== parseInt(taskId))
    setTasksInLocalStorage(updatedTasks)
    tasksCounter(updatedTasks)

    document
        .getElementById("todo-list")
        .removeChild(document.getElementById(taskId))
}

const removeDoneTasks = () => {
    const tasks = getTasksFromLocalStorage()
    const tasksToRemove = tasks
        .filter(({ checked }) => checked)
        .map(({ id }) => id)     
        
    const updatedTasks = tasks.filter(({ checked }) => !checked)
    setTasksInLocalStorage(updatedTasks)
    tasksCounter(updatedTasks)

    tasksToRemove.forEach((taskToRemove) => {
        document
            .getElementById('todo-list')
            .removeChild(document.getElementById(taskToRemove))
    })
}

const createTaskListItem = (task, checkbox) => {
    const list = document.getElementById('todo-list')
    const toDo = document.createElement('li')
    
    const removeTaskButton = document.createElement('button')
    removeTaskButton.textContent = 'X'
    removeTaskButton.ariaLabel = 'Remover Tarefa'
    
    removeTaskButton.onclick = () => removeTask(task.id)

    toDo.id = task.id
    toDo.appendChild(checkbox)
    toDo.appendChild(removeTaskButton)
    list.appendChild(toDo)

    return toDo
}

const onCheckboxClick = (event) => {
    const id = event.target.id.split('-')[0]
    const tasks = getTasksFromLocalStorage()

    const updatedTasks = tasks.map((task) => {
        return parseInt(task.id) === parseInt(id)
        ? { ...task, checked: event.target.checked }
        : task
    })

    setTasksInLocalStorage(updatedTasks)
    tasksCounter(updatedTasks)
}

const getCheckboxInput = ({ id, description, checked }) => {
    const checkbox = document.createElement('input')
    const label = document.createElement('label')
    const wrapper = document.createElement('div')
    const checkboxId = `${id}-checkbox`
    checkbox.addEventListener('change', onCheckboxClick)

    checkbox.type = 'checkbox'
    checkbox.id = checkboxId
    checkbox.checked = checked || false
    
    label.textContent = description
    label.htmlFor = checkboxId
    wrapper.className = 'checkbox-label-container'

    wrapper.appendChild(checkbox)
    wrapper.appendChild(label)

    return wrapper
}

const getNewTaskId = () => {
    const tasks = getTasksFromLocalStorage()
    const lastId = tasks[tasks.length - 1]?.id
    return lastId ? lastId + 1 : 1;
}

const getNewTaskData = (event) => {
    var description = event.target.elements.description.value
    var firstUpperCase = description[0].toUpperCase()
    description = firstUpperCase + description.slice(1)
    const id = getNewTaskId()
    return { id, description}
}

const createTask = (event) => {
    event.preventDefault()
    const newTaskData = getNewTaskData(event)

    const checkbox = getCheckboxInput(newTaskData)
    createTaskListItem(newTaskData, checkbox)

    const tasks = getTasksFromLocalStorage()
    const updatedTasks = [
        ...tasks,
        {id: newTaskData.id, description: newTaskData.description, checked: false}
    ]
    setTasksInLocalStorage(updatedTasks)
    tasksCounter(updatedTasks)

    document.getElementById('description').value = ''
}

window.onload = function() {
    const form = document.getElementById('create-todo-form')
    form.addEventListener('submit', createTask)

    tasksCounter(updatedTasks)

    const tasks = getTasksFromLocalStorage()

    tasks.forEach((task) =>{
        const checkbox = getCheckboxInput(task)
        createTaskListItem(task, checkbox)
    })
}