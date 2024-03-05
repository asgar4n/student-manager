let studentCounter = 0;

// Populate existing students on page load
fetchData();

function fetchData() {
  axios.get("https://crudcrud.com/api/579e458d37b048198edd09a85520b935/students")
    .then(response => {
      const studentList = document.getElementById('studentList');
      studentList.innerHTML = "";
      studentCounter = 0;

      response.data.forEach(student => {
        const studentContainer = createStudentElement(student.name, student.phoneNumber, student.address, student._id);
        studentList.appendChild(studentContainer);
        studentCounter++;
      });

      document.getElementById('counter').textContent = studentCounter;
    })
    .catch(error => console.error('Error fetching data:', error));
}

function addStudent() {
  const name = document.getElementById('name').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const address = document.getElementById('address').value;
  const editStudentId = document.getElementById('editStudentId').value;

  if (name && phoneNumber && address) {
    if (editStudentId) {
      // Update the existing student
      updateStudent(editStudentId, name, phoneNumber, address);
    } else {
      // Add a new student
      axios.post("https://crudcrud.com/api/579e458d37b048198edd09a85520b935/students", { name, phoneNumber, address })
        .then(response => {
          const studentContainer = createStudentElement(name, phoneNumber, address, response.data._id);
          document.getElementById('studentList').appendChild(studentContainer);
          studentCounter++;
          document.getElementById('counter').textContent = studentCounter;
        })
        .catch(error => console.error('Error adding student:', error));
    }

    // Clear input fields and editStudentId
    document.getElementById('name').value = '';
    document.getElementById('phoneNumber').value = '';
    document.getElementById('address').value = '';
    document.getElementById('editStudentId').value = '';
  } else {
    alert('Please fill in all fields before adding a student.');
  }
}

function editStudent(studentId) {
  axios.get(`https://crudcrud.com/api/579e458d37b048198edd09a85520b935/students/${studentId}`)
    .then(response => {
      const { name, phoneNumber, address } = response.data;
      document.getElementById('name').value = name;
      document.getElementById('phoneNumber').value = phoneNumber;
      document.getElementById('address').value = address;

      // Set the edited student ID
      document.getElementById('editStudentId').value = studentId;
    })
    .catch(error => console.error('Error fetching student details:', error));
}

function deleteStudent(container, studentId) {
  axios.delete(`https://crudcrud.com/api/579e458d37b048198edd09a85520b935/students/${studentId}`)
    .then(response => {
      container.remove();

      // Decrement student counter
      studentCounter--;
      document.getElementById('counter').textContent = studentCounter;
    })
    .catch(error => console.error('Error deleting student:', error));
}

function updateStudent(studentId, name, phoneNumber, address) {
  const studentContainer = document.querySelector(`[data-student-id="${studentId}"]`);
  const studentDetailsElement = studentContainer.querySelector('.student-details');
  studentDetailsElement.textContent = `Name: ${name} - Phone: ${phoneNumber} - Address: ${address}`;

  // Update student data
  axios.put(`https://crudcrud.com/api/579e458d37b048198edd09a85520b935/students/${studentId}`, { name, phoneNumber, address })
    .then(response => console.log('Student updated:', response.data))
    .catch(error => console.error('Error updating student:', error));
}

function createStudentElement(name, phoneNumber, address, studentId) {
  const studentContainer = document.createElement('div');
  studentContainer.classList.add('student-container');
  studentContainer.setAttribute('data-student-id', studentId);

  const studentDetailsElement = document.createElement('div');
  studentDetailsElement.classList.add('student-details');
  studentDetailsElement.textContent = `Name: ${name} - Phone: ${phoneNumber} - Address: ${address}`;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.classList.add('edit-btn');
  editButton.onclick = function() {
    editStudent(studentId);
  };

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete-btn');
  deleteButton.onclick = function() {
    deleteStudent(studentContainer, studentId);
  };

  buttonsContainer.appendChild(editButton);
  buttonsContainer.appendChild(deleteButton);

  studentContainer.appendChild(studentDetailsElement);
  studentContainer.appendChild(buttonsContainer);

  return studentContainer;
}
