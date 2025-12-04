const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcrypt");

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
    const { year, branch, section = "A", day } = req.query;
    
    if(day === "" || day === undefined){
      const query = `select day, period_id, subject_id, subject_name, teacher_name from schedule where year = ? and branch_id = ? and section = ? order by day, period_id`;
      const [rows] =  await pool.query(query, [
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
      
    }else{
      const query = `select period_id, subject_id, subject_name, teacher_name from schedule where year = ? and branch_id = ? and section = ? and day = ? order by period_id`;
      const [classes] =  await pool.query(query, [
        year, branch, section, day
      ]);

      res.json({
        success: true,
        data: {day: day, classes: classes}
      })
    }
    
  } catch (err) {
    console.log(err);
  }
})



// ✅ Start server
const PORT = 8000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


