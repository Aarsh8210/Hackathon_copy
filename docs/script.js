const API_BASE = "https://dayflow-backend-dgio.onrender.com";

/* ===================== LOGIN ===================== */
function login() {
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;
    const selectedRole = document.getElementById("role").value;

    fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password,
            role: selectedRole
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Invalid login");
        return res.json();
    })
    .then(data => {
        if (data.role === "employee") {
            window.location.href = "employee_dashboard.html";
        } else if (data.role === "admin") {
            window.location.href = "admin_dashboard.html";
        }
    })
    .catch(() => {
        alert("Login failed. Check credentials and role.");
    });
}

/* ===================== LEAVE ===================== */
function applyLeave() {
    const leaveType = document.querySelector("select").value;
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const remarks = document.querySelector("textarea").value;

    if (!fromDate || !toDate) {
        alert("Please select dates");
        return;
    }

    fetch(`${API_BASE}/leave/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            type: leaveType,
            from: fromDate,
            to: toDate,
            remarks: remarks
        })
    })
    .then(res => res.json())
    .then(() => {
        alert("Leave request submitted successfully");
    })
    .catch(err => {
        alert("Error submitting leave");
        console.error(err);
    });
}

function loadLeaves() {
    fetch(`${API_BASE}/leave/list`)
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById("leaveTable");
            if (!table) return;

            table.innerHTML = "";
            data.forEach((leave, index) => {
                table.innerHTML += `
                    <tr>
                        <td>${leave.type}</td>
                        <td>${leave.from}</td>
                        <td>${leave.to}</td>
                        <td>${leave.status}</td>
                        <td>
                            <button onclick="updateLeave(${index}, 'Approved')">Approve</button>
                            <button onclick="updateLeave(${index}, 'Rejected')">Reject</button>
                        </td>
                    </tr>
                `;
            });
        });
}

function updateLeave(index, status) {
    fetch(`${API_BASE}/leave/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index, status })
    })
    .then(res => res.json())
    .then(() => {
        alert("Leave " + status);
        loadLeaves();
    })
    .catch(err => console.error(err));
}

/* ===================== ATTENDANCE ===================== */
function checkIn() {
    fetch(`${API_BASE}/attendance/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "emp@dayflow.com" })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) alert(data.error);
        else alert("Checked in successfully");
    });
}

function checkOut() {
    fetch(`${API_BASE}/attendance/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "emp@dayflow.com" })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) alert(data.error);
        else alert("Checked out successfully");
    });
}

function loadAttendance() {
    fetch(`${API_BASE}/attendance/list`)
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById("attendanceTable");
            if (!table) return;

            table.innerHTML = "";
            data.forEach(rec => {
                table.innerHTML += `
                    <tr>
                        <td>${rec.email}</td>
                        <td>${rec.date}</td>
                        <td>${rec.check_in}</td>
                        <td>${rec.check_out || "-"}</td>
                        <td>${rec.status}</td>
                    </tr>
                `;
            });
        });
}

/* ===================== EMPLOYEE PROFILE ===================== */
function loadProfile() {
    fetch(`${API_BASE}/profile`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("name").innerText = data.name;
            document.getElementById("email").innerText = data.email;
            document.getElementById("role").innerText = data.role;
            document.getElementById("department").innerText = data.department;
            document.getElementById("designation").innerText = data.designation;
            document.getElementById("salary").innerText = data.salary;

            document.getElementById("phone").value = data.phone;
            document.getElementById("address").value = data.address;
        });
}

function updateProfile() {
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    fetch(`${API_BASE}/profile/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, address })
    })
    .then(res => res.json())
    .then(() => alert("Profile updated successfully"));
}

/* ===================== ADMIN PROFILE ===================== */
function loadAdminProfile() {
    fetch(`${API_BASE}/admin/profile`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("name").innerText = data.name;
            document.getElementById("email").innerText = data.email;
            document.getElementById("role").innerText = data.role;
            document.getElementById("department").innerText = data.department;

            document.getElementById("phone").value = data.phone;
            document.getElementById("address").value = data.address;
        });
}

function updateAdminProfile() {
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    fetch(`${API_BASE}/admin/profile/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, address })
    })
    .then(res => res.json())
    .then(() => alert("Admin profile updated successfully"));
}

/* ===================== ADMIN → EMPLOYEE ===================== */
function loadEmployeeForAdmin() {
    fetch(`${API_BASE}/admin/employee/profile`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("emp_name").value = data.name;
            document.getElementById("emp_email").value = data.email;
            document.getElementById("emp_department").value = data.department;
            document.getElementById("emp_designation").value = data.designation;
            document.getElementById("emp_phone").value = data.phone;
            document.getElementById("emp_address").value = data.address;
            document.getElementById("emp_salary").value = data.salary;
        });
}

function updateEmployeeByAdmin() {
    fetch(`${API_BASE}/admin/employee/profile/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: document.getElementById("emp_name").value,
            email: document.getElementById("emp_email").value,
            department: document.getElementById("emp_department").value,
            designation: document.getElementById("emp_designation").value,
            phone: document.getElementById("emp_phone").value,
            address: document.getElementById("emp_address").value,
            salary: document.getElementById("emp_salary").value
        })
    })
    .then(res => res.json())
    .then(() => alert("Employee profile updated by admin"));
}

/* ===================== SIGNUP ===================== */
function signup() {
    const employeeId = document.getElementById("employeeId").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            employee_id: employeeId,
            email: email,
            password: password,
            role: role
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert("Signup successful! Please login.");
            window.location.href = "login.html";
        }
    })
    .catch(err => {
        alert("Signup failed");
        console.error(err);
    });
}

/* ===================== NAVIGATION ===================== */
function goEmployeeDashboard() {
    window.location.href = "employee_dashboard.html";
}

function goAdminDashboard() {
    window.location.href = "admin_dashboard.html";
}
