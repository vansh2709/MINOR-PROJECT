const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcrypt");
const admin = require("./firebaseAdmin");
const cron = require("node-cron");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Create MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "scheduler",
  password: "rahul@1992#",
});

// get fcm token from client
app.post("/save-fcm-token", async (req, res) => {
  const { email, token, topics } = req.body;
  const query = "update users set fcm_token = ? where email = ?";

  // subscribe to topics
  topics.forEach(async (topic) => {
    await admin.messaging().subscribeToTopic(token, topic);
  })

  try {
    const response = await pool.query(query, [token, email]);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err });
  }
})



// ✅ Endpoint: Validate credentials
app.post("/validate-creds", async (req, res) => {
  try {
    const data = req.body; // e.g., { username: "john" }
    console.log(data)

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ success: false, message: "no fields provided" });
    }

    // Build WHERE clause dynamically
    const fields = Object.keys(data);
    const values = Object.values(data);
    const whereClause = fields.map(f => `${f} = ?`).join(" AND ");

    const [rows] = await pool.query(
      `SELECT * FROM users WHERE ${whereClause} LIMIT 1`,
      values
    );

    if (rows.length > 0) {
      res.json({ success: true, message: "credentials found" });
    } else {
      res.json({ success: false, message: "credentials not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password)

  // basic validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }

  // authentication from database / get password hash from databse
  const [user] = await pool.query(`select * from users where email = ?`, email);

  if (!user[0].email) {
    res.json({ success: false, message: "user not found" });
    return;
  }

  // compare the password hash
  const isMatch = await bcrypt.compare(password, user[0].password_hash);

  if (isMatch) {
    delete user[0].password_hash;
    res.json({ success: true, message: "user authenticated and authorised", user_creds: user[0] });
  } else {
    res.json({ success: false, message: "Incorrect password", });
  }
})

app.post("/register", async (req, res) => {
  const { role, name, email, password, student_id, teacher_id, branch, year } = req.body;

  if (!email || !password) {
    res.json({ success: false, message: "Credentials required" })
  }

  const response = await fetch("http://localhost:8000/validate-creds", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      [student_id === "" ? "teacher_id" : "student_id"]: student_id === "" ? teacher_id : student_id
    })
  })

  const responseJSON = await response.json();

  if (responseJSON.success == false) {
    // convert password to password hash
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    console.log(password)

    req.body.password = password_hash;

    pool.query(
      `INSERT INTO users (role, name, email, password_hash, student_id, teacher_id, branch, year)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      Object.values(req.body).map(v => v === "" ? "NULL" : v),
      (err, result) => {
        if (err) {
          console.error("Error inserting user:", err);
        } else {
          console.log("User inserted successfully:", result.insertId);
        }
      }
    );

    res.json({ success: true, message: "Registered Successfully" });
  } else {
    res.json({ success: false, message: "Already Registered" })
  }
})


// fetch timetable
app.get("/get-timetable", async (req, res) => {
  try {
    const { year, branch, section = "A", day, teacher_id, teacher_name } = req.query;

    if (teacher_id) {

      if (day === "" || day === undefined) {
        const query = `select period_id, subject_id, subject_name, teacher_name from schedule where teacher_id = ? order by period_id`;
        const [rows] = await pool.query(query, [
          year, branch, section,
        ]);

        let timetable = {};
        rows.forEach(row => {
          if (!timetable[row.day]) {
            timetable[row.day] = [];
          }
          timetable[row.day].push({
            period_id: row.period_id,
            subject_id: row.subject_id,
            subject_name: row.subject_name,
            teacher_name: row.teacher_name
          });
        });

        res.json({
          success: true,
          data: timetable
        });
      } else {
        const query = `select period_id, subject_id, subject_name, teacher_name from schedule where teacher_id = ? and day = ? order by period_id`;
        const [classes] = await pool.query(query, [teacher_id, day
        ]);

        res.json({
          success: true,
          data: { day: day, classes: classes }
        })

      }


    } else {
      if (day === "" || day === undefined) {
        const query = `select day, period_id, subject_id, subject_name, teacher_name from schedule where year = ? and branch_id = ? and section = ? order by day, period_id`;
        const [rows] = await pool.query(query, [
          year, branch, section,
        ]);

        let timetable = {};
        rows.forEach(row => {
          if (!timetable[row.day]) {
            timetable[row.day] = [];
          }
          timetable[row.day].push({
            period_id: row.period_id,
            subject_id: row.subject_id,
            subject_name: row.subject_name,
            teacher_name: row.teacher_name
          });
        });

        res.json({
          success: true,
          data: timetable
        });

      } else {
        const query = `select period_id, subject_id, subject_name, teacher_name from schedule where year = ? and branch_id = ? and section = ? and day = ? order by period_id`;
        const [classes] = await pool.query(query, [
          year, branch, section, day
        ]);

        res.json({
          success: true,
          data: { day: day, classes: classes }
        })
      }
    }
  } catch (err) {
    console.log(err);
  }
})

// fetch leave
app.get("/fetch-leaves", async (req, res) => {
  const { user_data } = req.query;
  const userData = JSON.parse((user_data));

  let query = "";
  let values = [];
  if (userData.role === "Student") {
    query = "select name, year, branch, student_id, subject, application, applicable_from, applicable_to, status, created_at from leaves where student_id = ? and month(created_at) = month(current_date()) and year(created_at) = year(current_date()) order by created_at desc";
    values = [userData.student_id]
  } else {
    query = `SELECT DISTINCT l.name, l.year, l.branch, l.student_id, l.subject, l.application, l.applicable_from, applicable_to, 
        l.status, l.created_at
      FROM leaves l
      JOIN schedule s 
        ON l.year = s.year 
        AND l.branch = s.branch_id
        AND l.section = s.section
      WHERE s.teacher_id = ?;
    `;
    values = [userData.teacher_id]
  }

  try {
    const [leaves] = await pool.query(query, values);
    res.json({ success: true, data: leaves, message: "leaves fetched" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err });
  }
})

// save leave
app.post("/upload-leave", async (req, res) => {
  const { applicant, subject, application, applicable_from, applicable_to } = req.body;

  let query = "";
  let values = [];
  if (applicant.role === "Student") {
    query = `insert into leaves (
      name, 
      year, 
      branch,
      student_id, 
      subject, 
      application, 
      applicable_from, 
      applicable_to, 
      status
    ) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    values = [applicant?.name, applicant?.year, applicant?.branch, applicant?.student_id, subject, application, applicable_from, applicable_to, "Pending"];
  } else {
    `insert into leaves (
      name,  
      teacher_id, 
      subject, 
      application, 
      applicable_from, 
      applicable_to, 
      status
    ) values (?, ?, ?, ?, ?, ?, ?)`;
    values = [applicant?.name, applicant?.teacher_id, subject, application, applicable_from, applicable_to, "Pending"];
  }

  try {
    const response = await pool.query(query, values);
    console.log(response)
    res.json({ success: true, message: "Leave submitted successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.json({ success: false, message: "Duplicate application found" })
      return;
    }
    console.log(err)
    res.json({ success: false, message: "error while submitting" })
  }
})


// modify leave ( reject approve )
app.get("/verify-leave", async (req, res) => {
  const {
    "x-action": action,
    "x-applicant": applicant,
    "x-verifier": verifier,
  } = req.headers;

  console.log(action, applicant, verifier)
  const query = `update leaves l set l.status = ? where l.student_id = ? 
  and exists (
    select 1
    from users u
    where u.teacher_id = ?
      and (u.role = 'Teacher' or u.role = 'HOD' or u.role = 'Director')
  )`

  try {
    const response = await pool.query(query, [action, applicant, verifier])
    res.json({success: true, message: "successfully " + action});
  } catch (error) {
    res.json({success: false, message: "error occuered"});
  }
})


// Announce 
app.post("/announce", async (req, res) => {
  const { title, body, status, target_year, target_branch, target_section, created_by, expires_at } = req.body;

  const query = "insert into announcements (title, body, created_by, target_year, target_branch, target_section, status, deleted_at) values(?, ?, ?, ?, ?, ?, ?, ?)"

  try {
    const response = await pool.query(query, [title, body, JSON.stringify(created_by), target_year, target_branch, target_section, status, expires_at.replace("T", " ")]);

    // send notification 
    const resp = await notify(title, body, target_year, target_branch, target_section, res);
    res.json({ success: true, message: "saved to server and notified to target: " + resp });

  } catch (err) {
    console.log(err)
    res.json({ success: false, error: err });
  }
})





// notify for next day timetable
// Night 10:00 pm
cron.schedule("0 22 * * *", () => {
  console.log("Running task at 10:00 PM every day");
  notifyTimetable();
}, { timezone: "Asia/Kolkata" })

// Morning 08:00 am
cron.schedule("0 8 * * *", () => {
  console.log("Running task at 08:00 AM every day");
  notifyTimetable();
}, { timezone: "Asia/Kolkata" })

async function notifyTimetable() {
  const years = [1, 2, 3, 4];
  const branches = ["CSE", "AI", "RA", "ME", "CE", "BCA"];
  const sections = ["A"];

  const topics = {};

  years.forEach(year => {
    const key = `${year}`;
    topics[key] = [];

    branches.forEach(branch => {
      // topics[key].push(`${branch}_${year}`);
      sections.forEach(async section => {
        topics[key].push(`${branch}_${year}_${section}`);
        const topic = `${branch}_${year}_${section}`;

        // send timetable notification
        const today = new Date();
        const dayName = today.toLocaleString('en-US', { weekday: 'long' });

        const [classes] = await pool.query("select period_id, subject_id, subject_name, teacher_name from schedule where year = ? and branch_id = ? and section = ? and day = ? order by period_id", [year, branch, section, dayName])

        let message = "";

        classes.forEach((clas) => {
          message += `${clas.period_id}) ${clas.subject_id} • ${clas.subject_name} - ${clas.teacher_name}\n`
        })

        if (classes.length > 0) {
          await admin.messaging().send({
            notification: {
              title: "Next Day Classes",
              body: message
            },
            topic: topic
          });
        }
      });
    });
  });
}


// ✅ Start server
const PORT = 8000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


// helpers

async function notify(title, body, target_year, target_branch, target_section) {
  return new Promise(async (resolve, reject) => {
    const query = `select fcm_token from users where role = ? ${target_year == "all" ? "" : 'and year = ?'} ${target_branch == "all" ? "" : 'and branch = ?'}  ${target_section == "all" ? "" : 'and section = ?'}`;

    const [students] = await pool.query(query, ["student", target_year, target_branch, target_section]);

    students.forEach(async (student) => {
      const token = student.fcm_token;
      const message = {
        notification: { title, body },
        token,
      };

      try {
        const response = await admin.messaging().send(message);
        console.log("Notification sent:", response);
        resolve(response);
      } catch (err) {
        console.error(err);
        resolve(err);
      }
    })
  })
}
