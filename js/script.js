
function addEmployee() {
    var editPopup = document.getElementById('edit-popup');
    if (editPopup) {
        editPopup.style.display = "block";
    }
}

function cancelAddEmployee() {
    var editPopup = document.getElementById('edit-popup');
    if (editPopup) {
        editPopup.style.display = "none";
    }
}

function saveNewEmployee() {
    var newName = document.getElementById("newName").value;
    var newId = document.getElementById("newId").value;
    var newEmail = document.getElementById("newEmail").value;
    var newDepartment = document.getElementById("newDepartment").value;
    var newPosition = document.getElementById("newPosition").value;

    // Add the new employee details to the table
    var table = document.getElementById("employee-table");
    var row = table.insertRow(-1);
    row.insertCell(0).innerHTML = newName;
    row.insertCell(1).innerHTML = newId;
    row.insertCell(2).innerHTML = newEmail;
    row.insertCell(3).innerHTML = newDepartment;
    row.insertCell(4).innerHTML = newPosition;
    row.insertCell(5).innerHTML = '<button onclick="editEmployee(this)">Edit</button> <button onclick="deleteEmployee(this)">Delete</button>';

    saveEmployees();
    
    cancelAddEmployee();
}

function editEmployee(button) {
    var row = button.parentNode.parentNode;
    var editPopup = document.getElementById('edit-popup');
    if (editPopup) {
        // Get the index of the row
        var rowIndex = row.rowIndex;

        // Set the values in the edit form
        document.getElementById("newName").value = row.cells[0].innerHTML;
        document.getElementById("newId").value = row.cells[1].innerHTML;
        document.getElementById("newEmail").value = row.cells[2].innerHTML;
        document.getElementById("newDepartment").value = row.cells[3].innerHTML;
        document.getElementById("newPosition").value = row.cells[4].innerHTML;

        // Show the edit popup
        editPopup.style.display = "block";

        // Handle the "Save" button click
        document.getElementById("saveButton").onclick = function() {
            row.cells[0].innerHTML = document.getElementById("newName").value;
            row.cells[1].innerHTML = document.getElementById("newId").value;
            row.cells[2].innerHTML = document.getElementById("newEmail").value;
            row.cells[3].innerHTML = document.getElementById("newDepartment").value;
            row.cells[4].innerHTML = document.getElementById("newPosition").value;

            saveEmployees();

            cancelAddEmployee();
        };
    }
}

function deleteEmployee(button) {
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
    saveEmployees();
}

function saveEmployees() {
    var table = document.getElementById("employee-table");
    var employees = [];
    for (var i = 1; i < table.rows.length; i++) {
        var employee = {};
        employee.name = table.rows[i].cells[0].innerHTML;
        employee.id = table.rows[i].cells[1].innerHTML;
        employee.email = table.rows[i].cells[2].innerHTML;
        employee.department = table.rows[i].cells[3].innerHTML;
        employee.position = table.rows[i].cells[4].innerHTML;
        employees.push(employee);
    }
    localStorage.setItem("employees", JSON.stringify(employees));
}

function loadEmployees() {
    var employees = JSON.parse(localStorage.getItem("employees"));
    if (employees) {
        var table = document.getElementById("employee-table");
        for (var i = 0; i < employees.length; i++) {
            var row = table.insertRow(-1);
            row.insertCell(0).innerHTML = employees[i].name;
            row.insertCell(1).innerHTML = employees[i].id;
            row.insertCell(2).innerHTML = employees[i].email;
            row.insertCell(3).innerHTML = employees[i].department;
            row.insertCell(4).innerHTML = employees[i].position;
            row.insertCell(5).innerHTML = '<button onclick="editEmployee(this)">Edit</button> <button onclick="deleteEmployee(this)">Delete</button>';
        }
    }
}

function loadAttendance() {
    var employees = JSON.parse(localStorage.getItem("employees"));
    if (employees) {
        var table = document.getElementById("attendance-table");
        for (var i = 0; i < employees.length; i++) {
            var row = table.insertRow(-1);
            row.insertCell(0).innerHTML = employees[i].name;
            row.insertCell(1).innerHTML = employees[i].id;
            var statusCell = row.insertCell(2);
            var dateCell = row.insertCell(3);
            
            // Input fields for status and date
            var statusInput = document.createElement("input");
            statusInput.type = "text";
            statusInput.value = employees[i].status;
            statusCell.appendChild(statusInput);

            var dateInput = document.createElement("input");
            dateInput.type = "date";
            dateInput.value = employees[i].date;
            dateCell.appendChild(dateInput);

            // Save button
            var saveButton = document.createElement("button");
            saveButton.innerHTML = "Save";
            saveButton.onclick = function(index) {
                return function() {
                    employees[index].status = statusInput.value;
                    employees[index].date = dateInput.value;
                    localStorage.setItem("employees", JSON.stringify(employees));

                    // Save attendance data
                    var attendanceData = JSON.parse(localStorage.getItem("attendanceData")) || [];
                    attendanceData.push({
                        name: employees[index].name,
                        id: employees[index].id,
                        status: statusInput.value,
                        date: dateInput.value
                    });
                    localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
                    
                    // Optionally, you can update the UI to reflect the changes
                };
            }(i); // Using an IIFE to capture the current value of 'i'
            row.appendChild(saveButton);
        }
    }
}

function loadPayroll() {
    var employees = JSON.parse(localStorage.getItem("employees"));
    if (employees) {
        var table = document.getElementById("payroll-table");
        for (var i = 0; i < employees.length; i++) {
            var row = table.insertRow(-1);
            row.insertCell(0).innerHTML = employees[i].name;
            row.insertCell(1).innerHTML = employees[i].id;
            row.insertCell(2).innerHTML = employees[i].department;
            row.insertCell(3).innerHTML = employees[i].position;
            
            // Display salary
            var salaryCell = row.insertCell(4);
            salaryCell.innerHTML = "₹" + employees[i].salary;

            // Edit salary button
            var editButton = document.createElement("button");
            editButton.innerHTML = "Set Salary";
            editButton.onclick = createEditFunction(i, employees[i].salary, salaryCell); // Pass index, current salary, and salary cell
            var editCell = row.insertCell(5);
            editCell.appendChild(editButton);
        }
    }
}

function createEditFunction(index, currentSalary, salaryCell) {
    return function() {
        var newSalary = prompt("Enter new salary:");
        if (newSalary !== null) {
            setSalary(index, parseFloat(newSalary)); // Call setSalary with correct index
            salaryCell.innerHTML = "$" + newSalary; // Update displayed salary
        }
    };
}

function setSalary(employeeIndex, newSalary) {
    var employees = JSON.parse(localStorage.getItem("employees"));
    if (employees && employeeIndex >= 0 && employeeIndex < employees.length) {
        employees[employeeIndex].salary = newSalary;
        localStorage.setItem("employees", JSON.stringify(employees)); // Save to local storage
        // Optionally, you can update the UI to reflect the changes
    }
}

function loadPerformance() {
    var employees = JSON.parse(localStorage.getItem("employees"));
    if (employees) {
        var table = document.getElementById("performance-table");
        for (var i = 0; i < employees.length; i++) {
            var row = table.insertRow(-1);
            row.insertCell(0).innerHTML = employees[i].name;
            row.insertCell(1).innerHTML = employees[i].id;
            
            // Display performance dropdown/select
            var performanceCell = row.insertCell(2);
            var select = document.createElement("select");
            select.id = "performance-" + i; // Unique ID for each select element
            var options = ["Excellent", "Good", "Average", "Worst"];
            for (var j = 0; j < options.length; j++) {
                var option = document.createElement("option");
                option.value = options[j];
                option.text = options[j];
                select.appendChild(option);
            }
            select.value = employees[i].performance || "Average"; // Set default value to "Average" if performance is not available
            performanceCell.appendChild(select);
            
            // Event listener to update performance in local storage when selection changes
            select.addEventListener("change", function(index) {
                return function() {
                    employees[index].performance = this.value;
                    localStorage.setItem("employees", JSON.stringify(employees));
                };
            }(i)); // Using an IIFE to capture the current value of 'i'
        }
    }
}



// Call loadPerformance function when the page loads
window.onload = function() {
    loadPerformance();
    loadPayroll();

};


// Load saved employees from local storage on page load
document.addEventListener('DOMContentLoaded', function () {
    loadEmployees();
    loadAttendance();
});

