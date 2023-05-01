let user_id;
let isAlreadyInDB = false;
let remindersData = [];
let selectedDay;

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

  if (name == "" || date == "") {
    alert("Please fill the reminder name and date.");
    return;
  }

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
  showReminder(selectedDay);

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
    alert(
      "Can not find the Assignment Table, please click show assignment table"
    );
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
  console.log(remindersData);
});

const reminderPage = document.querySelector(".reminder-wrapper"),
  addReminderTitle = document.querySelector(".reminder-name"),
  addReminderDate = document.querySelector(".reminder-date"),
  reminderContainer = document.querySelector(".reminders"),
  reminderHeader = document.querySelector(".reminder-header"),
  reminderCloseBtn = document.querySelector(".close");

reminderCloseBtn.addEventListener("click", () => {
  reminderPage.classList.remove("active");
});

addReminderTitle.addEventListener("input", (e) => {
  addReminderTitle.value = addReminderTitle.value.slice(0, 50);
});

addReminderDate.addEventListener("input", (e) => {
  console.log(addReminderDate.value);
});

function addListener() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      selectedDay = Number(e.target.innerHTML);
      getSelectedDay(e.target.innerHTML);
      showReminder(e.target.innerHTML);
      if (
        !(
          e.target.classList.contains("prev-date") ||
          e.target.classList.contains("next-date")
        )
      ) {
        days.forEach((day) => {
          day.classList.remove("selected");
        });
        e.target.classList.add("selected");
      }
    });
  });
}

function getSelectedDay(date) {
  let header = "";
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  console.log(dayName);
  console.log(date + " " + months[month] + " " + year);
  header = `<h2 class="date">${date} ${months[month]} ${year}</h2>
  <i class="close">x</i>`;
  reminderHeader.innerHTML = header;
}

function showReminder(date) {
  let reminders = "";
  for (let i = 0; i < remindersData.length; i++) {
    let reminderDate = remindersData[i].reminder_date;
    let ymd = reminderDate.split("-");
    let int_ymd = ymd.map((date_string) => {
      return parseInt(date_string);
    });
    console.log(int_ymd);

    if (year == int_ymd[0] && month + 1 == int_ymd[1] && date == int_ymd[2]) {
      reminders += `<div class="reminder">
        <div class="title">
          <i>-</i>
          <h3 class="reminder-title">${remindersData[i].reminder_name}</h3>
          <i class="delete" onclick="deleteReminder(${i})">x</i>
        </div>
      </div>`;
    }
  }

  if (reminders == "") {
    reminders = `<div class="no-reminder">
        <h3>No Reminders</h3>
    </div>`;
  }

  reminderContainer.innerHTML = reminders;
  reminderPage.classList.add("active");
  const reminderCloseBtn = document.querySelector(".close");
  reminderCloseBtn.addEventListener("click", () => {
    reminderPage.classList.remove("active");
  });
}
