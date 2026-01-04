from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Temporary in-memory data
users = [
    {"email": "emp@dayflow.com", "password": "1234", "role": "employee"},
    {"email": "admin@dayflow.com", "password": "1234", "role": "admin"}
]

leave_requests = []

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json(force=True)
    for user in users:
        if (
    user["email"] == data["email"]
    and user["password"] == data["password"]
    and user["role"] == data["role"]
):

            return jsonify({"status": "success", "role": user["role"]})
    return jsonify({"status": "error", "message": "Invalid credentials"}), 401


@app.route("/leave/apply", methods=["POST"])
def apply_leave():
    data = request.get_json(force=True)
    leave_requests.append({
        "type": data.get("type"),
        "from": data.get("from"),
        "to": data.get("to"),
        "remarks": data.get("remarks"),
        "status": "Pending"
    })
    return jsonify({"status": "Leave request submitted"})


@app.route("/leave/list", methods=["GET"])
def list_leave():
    return jsonify(leave_requests)


@app.route("/leave/update", methods=["POST", "OPTIONS"])
def update_leave():
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    data = request.get_json(force=True)
    index = data.get("index")
    status = data.get("status")

    if index is None or index >= len(leave_requests):
        return jsonify({"error": "Invalid index"}), 400

    leave_requests[index]["status"] = status
    return jsonify({"status": "Leave updated"}), 200
from datetime import datetime

attendance_records = []

@app.route("/attendance/checkin", methods=["POST"])
def attendance_checkin():
    data = request.get_json(force=True)
    email = data.get("email")
    today = datetime.now().strftime("%Y-%m-%d")

    for record in attendance_records:
        if record["email"] == email and record["date"] == today:
            return jsonify({"error": "Already checked in"}), 400

    attendance_records.append({
        "email": email,
        "date": today,
        "check_in": datetime.now().strftime("%H:%M:%S"),
        "check_out": None,
        "status": "Present"
    })

    return jsonify({"status": "Checked in"})


@app.route("/attendance/checkout", methods=["POST"])
def attendance_checkout():
    data = request.get_json(force=True)
    email = data.get("email")
    today = datetime.now().strftime("%Y-%m-%d")

    for record in attendance_records:
        if record["email"] == email and record["date"] == today:
            if record["check_out"] is not None:
                return jsonify({"error": "Already checked out"}), 400

            record["check_out"] = datetime.now().strftime("%H:%M:%S")
            return jsonify({"status": "Checked out"})

    return jsonify({"error": "No check-in found"}), 400


@app.route("/attendance/list", methods=["GET"])
def attendance_list():
    return jsonify(attendance_records)

employee_profile = {
    "name": "John Doe",
    "email": "emp@dayflow.com",
    "role": "Employee",
    "department": "Engineering",
    "designation": "Software Engineer",
    "phone": "9876543210",
    "address": "Ahmedabad, Gujarat",
    "salary": "₹30,000"
}

@app.route("/profile", methods=["GET"])
def get_profile():
    return jsonify(employee_profile)


@app.route("/profile/update", methods=["POST"])
def update_profile():
    data = request.get_json(force=True)

    # Employee can edit limited fields
    employee_profile["phone"] = data.get("phone", employee_profile["phone"])
    employee_profile["address"] = data.get("address", employee_profile["address"])

    return jsonify({"status": "Profile updated"})
admin_profile = {
    "name": "Admin User",
    "email": "admin@dayflow.com",
    "role": "Admin / HR",
    "department": "Human Resources",
    "phone": "9998887776",
    "address": "Ahmedabad, Gujarat"
}

@app.route("/admin/profile", methods=["GET"])
def get_admin_profile():
    return jsonify(admin_profile)


@app.route("/admin/profile/full-update", methods=["POST"])
def admin_full_update_profile():
    data = request.get_json(force=True)

    for key in admin_profile:
        if key in data:
            admin_profile[key] = data[key]

    return jsonify({"status": "Admin profile fully updated"})

@app.route("/admin/employee/profile", methods=["GET"])
def admin_get_employee_profile():
    return jsonify(employee_profile)


@app.route("/admin/employee/profile/update", methods=["POST"])
def admin_update_employee_profile():
    data = request.get_json(force=True)

    # Admin can update all fields
    for key in employee_profile:
        if key in data:
            employee_profile[key] = data[key]

    return jsonify({"status": "Employee profile updated by admin"})
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(force=True)

    employee_id = data.get("employee_id")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    # Basic validation
    if not employee_id or not email or not password or not role:
        return jsonify({"error": "All fields are required"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    # Check if user already exists
    for user in users:
        if user["email"] == email:
            return jsonify({"error": "User already exists"}), 400

    # Add user (in-memory)
    users.append({
        "email": email,
        "password": password,
        "role": role
    })

    return jsonify({
        "status": "Signup successful",
        "note": "Email verification planned as future enhancement"
    })


if __name__ == "__main__":
    app.run(debug=True)
