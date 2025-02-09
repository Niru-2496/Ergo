document.addEventListener("DOMContentLoaded", function () {
    const monthYear = document.getElementById("monthYear");
    const datesContainer = document.getElementById("dates");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");
    const taskInput = document.getElementById("taskInput");
    const taskDate = document.getElementById("taskDate");
    const taskTime = document.getElementById("taskTime");
    const addTaskBtn = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    const deleteOverdueBtn = document.getElementById("deleteOverdue");

    let currentDate = new Date();
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function renderCalendar() {
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth();

        // Ensure year stays between 2025 and 2035
        if (year < 2025) currentDate.setFullYear(2025);
        if (year > 2035) currentDate.setFullYear(2035);

        monthYear.innerText = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        let firstDay = new Date(year, month, 1).getDay();
        let daysInMonth = new Date(year, month + 1, 0).getDate();
        datesContainer.innerHTML = "";

        for (let i = 0; i < firstDay; i++) {
            datesContainer.appendChild(document.createElement("div"));
        }

        for (let day = 1; day <= daysInMonth; day++) {
            let dateDiv = document.createElement("div");
            dateDiv.innerText = day;
            let dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

            if (tasks.some(task => task.date === dateStr)) {
                dateDiv.classList.add("has-task");
            }

            if (new Date(dateStr) < new Date().setHours(0, 0, 0, 0)) {
                dateDiv.classList.add("overdue");
            }

            dateDiv.addEventListener("click", () => {
                let taskForDate = tasks.filter(task => task.date === dateStr);
                alert(taskForDate.length ? taskForDate.map(t => `${t.name} at ${t.time}`).join("\n") : "No tasks");
            });

            datesContainer.appendChild(dateDiv);
        }
    }

    function renderTaskList() {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            let li = document.createElement("li");
            li.innerHTML = `${task.date} ${task.time} - ${task.name}
                <button class="complete" data-index="${index}">✔</button>
                <button class="delete" data-index="${index}">❌</button>`;

            li.querySelector(".complete").addEventListener("click", () => completeTask(index));
            li.querySelector(".delete").addEventListener("click", () => deleteTask(index));

            taskList.appendChild(li);
        });
    }

    function addTask() {
        let taskName = taskInput.value.trim();
        let taskDateValue = taskDate.value;
        let taskTimeValue = taskTime.value;

        if (!taskName || !taskDateValue || !taskTimeValue) {
            return alert("Please enter task, date, and time!");
        }

        let selectedYear = new Date(taskDateValue).getFullYear();
        if (selectedYear < 2025 || selectedYear > 2035) {
            return alert("Please select a date between 2025 and 2035!");
        }

        tasks.push({ name: taskName, date: taskDateValue, time: taskTimeValue });
        tasks.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

        localStorage.setItem("tasks", JSON.stringify(tasks));
        alert("Task added successfully!");

        renderCalendar();
        renderTaskList();
    }

    function completeTask(index) {
        alert("Good job!");
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderCalendar();
        renderTaskList();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderCalendar();
        renderTaskList();
    }

    function deleteOverdueTasks() {
        let now = new Date().setHours(0, 0, 0, 0);
        let overdueTasks = tasks.filter(task => new Date(task.date) < now);

        if (overdueTasks.length === 0) {
            alert("No overdue tasks to delete!");
            return;
        }

        let confirmDelete = confirm(`Are you sure you want to delete ${overdueTasks.length} overdue task(s)?`);
        if (confirmDelete) {
            tasks = tasks.filter(task => new Date(task.date) >= now);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            alert("Overdue tasks deleted successfully!");
            renderCalendar();
            renderTaskList();
        }
    }

    prevMonthBtn.addEventListener("click", () => {
        let year = currentDate.getFullYear();
        if (year > 2025 || (year === 2025 && currentDate.getMonth() > 0)) {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        }
    });

    nextMonthBtn.addEventListener("click", () => {
        let year = currentDate.getFullYear();
        if (year < 2035 || (year === 2035 && currentDate.getMonth() < 11)) {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        }
    });

    addTaskBtn.addEventListener("click", addTask);
    deleteOverdueBtn.addEventListener("click", deleteOverdueTasks);

    renderCalendar();
    renderTaskList();
});