const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = `<h3>${months[month] + " " + year}</h3>`;

  let days = "";
  //add blank prev date
  for (let i = day; i > 0; i--) {
    days += `<div class="day prev-date"></div>`;
  }
  //add days of that month
  for (let i = 1; i <= lastDate; i++) {
    if (
      i == new Date().getDate() &&
      year == new Date().getFullYear() &&
      month == new Date().getMonth()
    ) {
      days += `<div class="day_today">${i}</div>`;
    } else {
      days += `<div class="day">${i}</div>`;
    }
  }
  //add blank next date
  for (let i = 1; i <= nextDays; i++) {
    days += `<div class="day next-date"></div>`;
  }

  daysContainer.innerHTML = days;
}

initCalendar();

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

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
