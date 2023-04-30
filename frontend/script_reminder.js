let user_id;
let isAlreadyInDB = false;
let remindersData = [];

const addNewUser = async () => {
    const itemToAdd = {
        user_id: user_id,
    };

    const options = {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(itemToAdd),
    };

    await fetch(`http://${backendIPAddress}/reminders/users`, options)
        .then((response) => console.log(response))
        .catch((error) => console.error(error));
};

const getReminders = async () => {
    const options = {
        method: "GET",
        credentials: "include",
    };
    await fetch(`http://${backendIPAddress}/reminders`, options)
        .then((response) => response.json())
        .then((data) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].user_id == user_id) {
                    isAlreadyInDB = true;
                    remindersData = data[i].reminders;
                    initCalendar();
                }
            }
        })
        .catch((error) => console.error(error));
    document.dispatchEvent(new Event("afterGetReminders"));
};

const addReminder = async () => {
    const name = document.querySelector(".reminder-name").value;
    const date = document.querySelector(".reminder-date").value;
    const assignment = document.querySelector(".assignment-to-add");
    const assignmentID = assignment.value;
    const assignmentName = assignment.options[assignment.selectedIndex].text;
    const reminderToAdd = {
        reminder_name: name,
        reminder_date: date,
        assignmentID: assignmentID,
        assignmentName: assignmentName,
    };

    remindersData.push(reminderToAdd);
    initCalendar();

    const itemToAdd = {
        user_id: user_id,
        reminders: remindersData,
    };

    const options = {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(itemToAdd),
    };

    await fetch(`http://${backendIPAddress}/reminders`, options)
        .then((response) => console.log(response))
        .catch((error) => console.error(error));
};

const deleteReminder = async (index) => {
    remindersData.splice(index, 1);
    initCalendar();

    const itemToAdd = {
        user_id: user_id,
        reminders: remindersData,
    };

    const options = {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(itemToAdd),
    };

    await fetch(`http://${backendIPAddress}/reminders`, options)
        .then((response) => console.log(response))
        .catch((error) => console.error(error));
};

const showAssignmentInReminder = async () => {
    const assignmentsTable = assignmentsContainer.querySelector(
        "#assignment-table-body"
    );
    if (assignmentsTable == null) {
        console.log("Can not find the Assignment Table.");
        return;
    }

    const assignmentToAdd = document.querySelector("#assignment-to-add");

    const assignmentList = assignmentsTable.querySelectorAll(".assignment");

    for (let i = 0; i < assignmentList.length; i++) {
        const assignmentID = assignmentList[i].id;
        const assignmentTitle = assignmentList[i].title;
        assignmentToAdd.innerHTML += `
          <option value='${assignmentID}'>${assignmentTitle}</option>
    `;
    }
};

document.addEventListener("afterGetID", async function () {
    user_id = document.getElementById("user-id").innerHTML;
    await getReminders();
    if (!isAlreadyInDB) {
        await addNewUser();
    }
});

const addReminderContainer = document.querySelector(".add-reminder-wrapper"),
    addReminderCloseBtn = document.querySelector(".close"),
    addReminderTitle = document.querySelector(".reminder-name"),
    addReminderDate = document.querySelector(".reminder-date");

addReminderCloseBtn.addEventListener("click", () => {
    addReminderContainer.classList.remove("active");
});

addReminderTitle.addEventListener("input", (e) => {
    addReminderTitle.value = addReminderTitle.value.slice(0, 50);
});

addReminderDate.addEventListener("input", (e) => {
    console.log(addReminderDate.value);
});
