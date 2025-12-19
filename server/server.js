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
    // console.log(topic)
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

    // check if cancelled periods are expired or not
    const cancel_cancelled_class_query = `UPDATE schedule
      SET cancelled = 0,
          cancelled_from = NULL,
          cancelled_to = NULL,
          substitute_teacher_id = NULL,
          substitute_teacher_name = NULL
      WHERE CURDATE() > DATE(cancelled_to);
    `;

    try {
      const response1 = await pool.query(cancel_cancelled_class_query);
      if (response1.affectedRows > 0) {
        console.log("removing expired leaves classes", response1);
      }
    } catch (error) {
      throw error;
    }

    if (teacher_id && teacher_id !== "undefined") {
      if (day === "" || day === undefined) {
        const query = `select id, day, period_id, subject_id, subject_name, teacher_name, cancelled from schedule where teacher_id = ? order by period_id`;
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
        const query = `select id, day, period_id, subject_id, subject_name, teacher_name, year, branch_id, branch_name, section, room_number, cancelled from schedule where teacher_id = ? and day = ? order by period_id`;
        const [classes] = await pool.query(query, [teacher_id, day
        ]);

        res.json({
          success: true,
          data: { day: day, classes: classes }
        })

      }


    } else {
      if (day === "" || day === undefined) {
        const query = `select day, period_id, subject_id, subject_name, teacher_name, cancelled from schedule where year = ? and branch_id = ? and section = ? order by day, period_id`;
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
        const query = `select day, period_id, subject_id, subject_name, teacher_name, cancelled from schedule where year = ? and branch_id = ? and section = ? and day = ? order by period_id`;
        const [classes] = await pool.query(query, [
          year, branch, section, day
        ]);

        res.json({
          success: true,
          message: "thrown classes",
          data: { day: day, classes: classes }
        })
      }
    }
  } catch (err) {
    res.json({
      success: false,
      message: "Internal server error"
    })
    console.log(err);
  }
})

// add / update schedule
app.post("/update-schedule", async (req, res)=>{
  const { action, subject_data } = req.body;

  let query = "";
  let values = Object.values(subject_data?.changes);

  if(action === "Update") {
    query = `update schedule set ${Object.keys(subject_data?.changes).map(key => `${key} = ? where id = ?`).join(", ")}`;
    values.push(subject_data.id);
  } else if(action === "Insert") {
    query = `insert into schedule (${Object.keys(subject_data?.changes).map(key => `${key}`).join(", ")}) values (${Object.keys(subject_data?.changes).map(key => "?").join(", ")})`;
  } else {
    query = "delete from schedule where id = ?";
    values = [subject_data.id];
  }


  try {
    const [result] = await pool.query(query, values);
    if(result.affectedRows > 0){
      res.json({success: true});
    }else{
      res.json({success: false});
    }
  } catch (error) {
    console.log(error)
    res.json({success: false, message: "Internal server error"});
  }
})


// fetch leave
app.get("/fetch-leaves", async (req, res) => {
  const { user_data } = req.query;
  const userData = JSON.parse((user_data));

  let query = "";
  let values = [];
  if (userData?.role === "Student") {
    query = "select name, year, branch, student_id, subject, application, applicable_from, applicable_to, status, created_at from leaves where student_id = ? and month(created_at) = month(current_date()) and year(created_at) = year(current_date()) order by created_at desc";
    values = [userData?.student_id]

  } else {
    query = `SELECT
      l.name,
      l.year,
      l.branch,
      l.student_id,
      l.subject,
      l.application,
      l.applicable_from,
      l.applicable_to,
      l.status,
      l.created_at,
      COUNT(*) OVER (PARTITION BY l.student_id) AS total_leaves
    FROM leaves l
    WHERE
      l.applicable_to > CURRENT_DATE
      AND EXISTS (
        SELECT 1
        FROM schedule s
        WHERE s.teacher_id = ?
          AND s.year = l.year
          AND s.branch_id = l.branch
          AND s.section = l.section
          AND FIND_IN_SET(s.day, l.affected_days)
      )
    ORDER BY l.created_at DESC;
    `;
    values = [userData?.teacher_id]
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

  const affected_days = getAffectedDays(applicable_from, applicable_to);

  // console.log(affected_days)

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
      status,
      affected_days
    ) select ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?
     where not exists (
      select 1 
      from leaves
      where student_id = ?
        and status = 'Pending'
     )`;
    values = [applicant?.name, applicant?.year, applicant?.branch, applicant?.student_id, subject, application, applicable_from, applicable_to, affected_days, applicant?.student_id];
  }

  try {
    const [response] = await pool.query(query, values);
    if (response.affectedRows === 0) {
      res.json({
        success: false,
        message: "You already have a pending leave request"
      });
    } else {
      res.json({
        success: true,
        message: "Leave submitted successfully"
      })
    }
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      res.json({ success: false, message: "Duplicate application found" })
      return;
    }
    console.log(err)
    res.json({ success: false, message: "error while submitting" })
  }
})


// verify leave ( reject approve )
app.get("/verify-leave", async (req, res) => {
  const {
    "x-action": action,
    "x-applicant": applicant,
    "x-verifier": verifierr,
  } = req.headers;

  const verifier = JSON.parse(verifierr);

  const query = `update leaves l set l.status = ? where l.student_id = ? 
  and exists (
    select 1
    from users u
    where u.teacher_id = ?
      and (u.role = 'Teacher' or u.role = 'HOD' or u.role = 'Director')
  )`

  try {
    const [response] = await pool.query(query, [action, applicant, verifier.teacher_id])

    if (response.affectedRows > 0) {
      res.json({ success: true, message: "successfully " + action });

      // notify user
      // fetch user fcm token
      const [tokens] = await pool.query("select fcm_token from users where student_id = ?", [applicant]);
      const token = tokens.length > 0 ? tokens[0].fcm_token : null;

      await notify(token, "Leave Verification", `Leave ${action} by ${verifier.role} - ${verifier.teacher_name}`);
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "error occuered" });
  }
})

// teacher availability
app.post("/teacher-availability", async (req, res) => {
  const { applicant, leave_type, classes, from, to, on } = req.body;
  let classess;

  // save leave to leaves table
  const query1 = `insert into leaves (
    name,  
    teacher_id, 
    subject, 
    application, 
    applicable_from, 
    applicable_to, 
    status
  ) values (?, ?, ?, ?, ?, ?, ?)`;

  const values1 = [applicant.name, applicant?.teacher_id, "Priviliged", "Priviliged", from || on, to || on, "Approved"];

  let query2 = "";
  let values2 = [];

  // if leave type = period
  if (leave_type == "period") {
    // Build tuple placeholders
    const tuplePlaceholders = classes.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");

    // Flatten all values into one array
    const tupleValues = classes.flatMap(c => [
      c.day,
      c.period,
      c.code,
      c.branch,
      c.year,
      c.section
    ]);

    query2 = `UPDATE schedule
    SET cancelled = ?, cancelled_from = ?, cancelled_to = ?
    WHERE teacher_id = ?
      AND (day, period_id, subject_id, branch_id, year, section) IN (${tuplePlaceholders});
    `;

    values2 = [
      1,
      from,
      to,
      applicant.teacher_id,
      ...tupleValues
    ];
  } else {
    // if leave type day | duration then check for affected periods
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const duration = (new Date(to || on) - new Date(from || on)) / (1000 * 3600 * 24) + 1;
    const int_day = new Date(from || on).getDay();

    const affected_days = new Set();;
    for (let i = int_day; i < int_day + duration; i++) {
      index = (i - 1) % 7
      affected_days.add(days[index])
    }

    // console.log(affected_days)

    query2 = `update schedule set cancelled = ?, cancelled_from = ?, cancelled_to = ? where teacher_id = ? and day in (${Array.from(affected_days).map(ad => "?").join(",")})`;

    values2 = [1, from || on, to || on, applicant.teacher_id, ...affected_days];
  }

  try {
    // const response1 = await pool.query(query1, values1);
    // console.log(response1);
    const response2 = await pool.query(query2, values2);

    // send notification to affected class
    // fetch affetected class
    let [classes] = await pool.query("select distinct * from schedule where day = ? and cancelled = 1 and teacher_id = ? and cancelled_from = ? and cancelled_to = ? order by year, period_id", ["Tuesday", applicant.teacher_id, from || on, to || on]);

    const notification = {};
    classes.forEach((clas) => {
      if (!notification[`${clas.branch_id}_${clas.year}_${clas.section}`]) {
        notification[`${clas.branch_id}_${clas.year}_${clas.section}`] = [clas];
      } else {
        notification[`${clas.branch_id}_${clas.year}_${clas.section}`].push(clas);
      }
    })

    Object.keys(notification).forEach(async (topic) => {
      // console.log(topic, `Period ${notification[topic].map((p => p.period_id)).join(", ")} of ${notification[topic][0].teacher_name} Cancelled`)

      await admin.messaging().send({
        notification: {
          title: "Class Cancelled",
          body: `Period ${notification[topic].map((p => p.period_id)).join(", ")} of ${notification[topic][0].teacher_name} Cancelled`
        },
        topic: topic
      });
    })

    res.json({ success: true, message: "Leave saved successfully" });
  } catch (error) {
    console.log(error)
    if (error.code === "ER_DUP_ENTRY") {
      res.json({ success: false, message: "Already submitted or duplicate leave" });
    } else {
      res.json({ success: false, message: "Error occured" });
    }
  }
})


// fetch announcemetns
app.get("/announcements", async (req, res) => {
  const { year, branch, section } = req.query;

  const query = `SELECT 
    title,
    body,
    created_by,
    status,
    created_at,
    delete_at
  FROM announcements
  WHERE status = 'Active'
    AND JSON_CONTAINS(target_year, JSON_ARRAY(?), '$.years')
    AND JSON_CONTAINS(target_branch, JSON_ARRAY(?), '$.branches')
    AND JSON_CONTAINS(target_section, JSON_ARRAY(?), '$.sections') 
    ORDER BY id DESC;
  `;
  const values = [year, branch, section];

  try {
    // set status expired
    await pool.query("update announcements set status = 'Expired' where current_timestamp > delete_at");

    const [announcements] = await pool.query(query, values);
    if (announcements.length > 0) {
      res.json({ success: true, data: announcements });
    }else{
      res.json({ success: true, data: [] });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, data: [] });
  }
})

// Announce 
app.post("/announce", async (req, res) => {
  const { title, body, status, target_year, target_branch, target_section, created_by, expires_at } = req.body;

  const query = "insert into announcements (title, body, created_by, target_year, target_branch, target_section, delete_at) values(?, ?, ?, ?, ?, ?, ?)"

  try {
    const response = await pool.query(query, [title, body, JSON.stringify(created_by), JSON.stringify({ years: target_year }), JSON.stringify({ branches: target_branch }), JSON.stringify({ sections: target_section }), expires_at.replace("T", " ")]);

    // send notification 
    const resp = await notifyGroup(title, body, target_year, target_branch, target_section, res);
    res.json({ success: true, message: "saved to server and notified to target: " });

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

async function notifyGroup(title, body, target_year, target_branch, target_section) {
  return new Promise(async (resolve, reject) => {

    const YEARS = ["1", "2", "3", "4"];
    const BRANCHES = ["CSE", "AI", "RA", "ME", "CE", "BCA"];
    const SECTIONS = ["A", "B", "C"];

    const years =
      target_year.includes("all") ? YEARS : target_year;

    const branches =
      target_branch.includes("all") ? BRANCHES : target_branch;

    const sections =
      target_section.includes("all") ? SECTIONS : target_section;

    const topics = [];

    for (const branch of branches) {
      for (const year of years) {
        for (const section of sections) {
          topics.push(`${branch}_${year}_${section}`);
        }
      }
    }

    console.log(topics);


    topics.forEach(async (topic) => {
      await admin.messaging().send({
        notification: {
          title: title,
          body: body
        },
        topic: topic
      });
    })

    resolve({ success: true })
  })
}


async function notify(token, title, body, data) {
  const message = {
    token,
    notification: {
      title: title,
      body: body,
    },
    data: data
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent:", response);
    return response;
  } catch (err) {
    console.error("FCM error:", err.message);
  }
}

function getAffectedDays(from, to) {
  const days = new Set();

  const start = new Date(from);
  const end = new Date(to);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.add(
      d.toLocaleString("en-US", { weekday: "long" })
    );
  }

  return [...days].join(",");
}


// update schedule set cancelled = 0, cancelled_from = NULL, cancelled_to = NULL;