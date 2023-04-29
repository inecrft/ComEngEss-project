const backendIPAddress = "127.0.0.1:3000";
const assignmentsContainer = document.querySelector(".assignments");

const authorizeApplication = () => {
  window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
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
        };
        courses_array.push(temp);
      }
      console.log(courses_array);
    })
    .catch((error) => console.error(error));
};

const createAssignmentList = async () => {
  let today = new Date();

  for (let i = 0; i < courses_array.length; i++) {
    const cv_cid = courses_array[i].cv_cid;
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

      assignmentsContainer.innerHTML += `
      <div class="assignment">
        <div class="title">
          <i>-</i>
          <h3 class="assignment-title">${assignments[i].title}</h3>
        </div>
        <div class="due-date">${assignments[i].duedate}</div>
      </div>
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

document.getElementById("group-id").innerHTML = getGroupNumber();
