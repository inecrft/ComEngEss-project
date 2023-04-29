const backendIPAddress = "127.0.0.1:3000";
const assignmentsContainer = document.querySelector(".assignments");

const authorizeApplication = () => {
    window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
};

const getGroupNumber = () => {
    return 15;
};

const getUserID = async () => {
    const options = {
        method: "GET",
        credentials: "include",
    };
    await fetch(`http://${backendIPAddress}/courseville/get_user_id`, options)
        .then((response) => response.json())
        .then((data) => {
            console.log(data.data.student.id);
            document.getElementById(
                "user-id"
            ).innerHTML = `${data.data.student.id}'s`;
        })
        .catch((error) => console.error(error));
};

const courses_array = [];
const getCourses = async () => {
    const options = {
        method: "GET",
        credentials: "include",
    };
    await fetch(`http://${backendIPAddress}/courseville/get_courses`, options)
        .then((response) => response.json())
        .then((data) => data.data.student)
        .then((courses) => {
            for (let i = 0; i < courses.length; i++) {
                const temp = {
                    cv_cid: courses[i].cv_cid,
                    course_no: courses[i].course_no,
                    title: courses[i].title,
                };
                courses_array.push(temp);
            }
            console.log(courses_array);
        })
        .catch((error) => console.error(error));
};

function getDueTimeInClock(dueTime) {
    let secondSince2022 = dueTime - 1637686800;
    let secondInTheDay = secondSince2022 % (24 * 60 * 60);
    let hourInDay = Math.floor(secondInTheDay / 3600);
    let minuteInHour = Math.floor((secondInTheDay - hourInDay * 3600) / 60);
    let secondInMinute = Math.floor(
        secondInTheDay - hourInDay * 3600 - minuteInHour * 60
    );
    return [hourInDay, minuteInHour, secondInMinute];
}

const createAssignmentList = async () => {
    assignmentsContainer.innerHTML = `
  <table class="assignment-table">
    <thead>
      <tr id="assignment-table-head">
          <th>Course Name</th>
          <th>Assignment</th>
          <th>Due Date</th>
          <th>Due Time</th>
      </tr>
    </thead>
    <tbody id="assignment-table-body">
    </tbody>
  </table>
  `;

    const assignmentsTable = assignmentsContainer.querySelector(
        "#assignment-table-body"
    );

    let today = new Date();

    for (let i = 0; i < courses_array.length; i++) {
        //console.log(courses_array[i]);
        const cv_cid = courses_array[i].cv_cid;
        const courseTitle = courses_array[i].title;
        let assignments;

        const options = {
            method: "GET",
            credentials: "include",
        };
        await fetch(
            `http://${backendIPAddress}/courseville/get_course_assignments/${cv_cid}`,
            options
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data.data);
                assignments = data.data;
            })
            .catch((error) => console.error(error));

        for (let i = 0; i < assignments.length; i++) {
            if (assignments[i].duedate != null) {
                const ymd = assignments[i].duedate.split("-");
                const int_ymd = ymd.map((date_string) => {
                    return parseInt(date_string);
                });
                if (int_ymd[0] < today.getFullYear()) {
                    continue;
                } else if (
                    int_ymd[0] == today.getFullYear() &&
                    int_ymd[1] < today.getMonth() + 1
                ) {
                    continue;
                } else if (
                    int_ymd[1] == today.getMonth() + 1 &&
                    int_ymd[2] < today.getDate()
                ) {
                    continue;
                }
            } else {
                continue;
            }

            let dueTimeArray = getDueTimeInClock(assignments[i].duetime);

            assignmentsTable.innerHTML += `
      <tr class="assignment" id="${cv_cid}-${assignments[i].itemid}">
        <td><a href="https://www.mycourseville.com/?q=courseville/course/${cv_cid}">${courseTitle}</a></td>
        <td><a href="https://www.mycourseville.com/?q=courseville/worksheet/${cv_cid}/${assignments[i].itemid}">${assignments[i].title}</a></td>
        <td>${assignments[i].duedate}</td>
        <td>${dueTimeArray[0]}:${dueTimeArray[1]}:${dueTimeArray[2]}</td>
      </tr>
      `;
        }

        // assignments.forEach((assignment) => {

        //     if (int_ymd[0] < today.getFullYear) {
        //       return;
        //     } else if (int_ymd[1] < today.getMonth) {
        //       return;
        //     } else if (int_ymd[2] < today.getDate) {
        //       return;
        //     }
        //   }

        //   assignmentsContainer.innerHTML += `
        //   <div class="assignment">
        //     <div class="title">
        //       <i>-</i>
        //       <h3 class="assignment-title">${assignment.title}</h3>
        //     </div>
        //     <div class="due-date">${assignment.duedate}</div>
        //   </div>
        //   `;
        // });
    }
};

const logout = async () => {
    window.location.href = `http://${backendIPAddress}/courseville/logout`;
};

//document.getElementById("group-id").innerHTML = getGroupNumber();
