// js/teachers.js
(function () {
  const { collection, addDoc, getDocs } = window.firebaseFns;

  window.addTeacher = async function addTeacher() {
    const name = document.getElementById("newTeacherName").value;
    const dept = document.getElementById("newTeacherDept").value;
    const subject = document.getElementById("newTeacherSubject").value;

    if (!name || !dept || !subject) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, 'teachers'), {
        name,
        department: dept,
        subject,
        createdAt: new Date()
      });
      logAction(auth.currentUser.uid, "ADD_TEACHER", name);
      alert("Teacher added successfully!");

      document.getElementById("newTeacherName").value = "";
      document.getElementById("newTeacherDept").value = "";
      document.getElementById("newTeacherSubject").value = "";

      loadTeachers();
    } catch (err) {
      alert("Error adding teacher: " + err.message);
      console.error(err);
    }
  };

  window.loadTeachers = async function loadTeachers() {
    const teacherListDiv = document.getElementById("teacher-list");
    if (!teacherListDiv) return;

    const snap = await getDocs(collection(db, 'teachers'));
    teacherListDiv.innerHTML = "";

    snap.forEach(docSnap => {
      const teacher = docSnap.data();
      const teacherDiv = document.createElement('div');
      teacherDiv.className = 'card';
      teacherDiv.innerHTML = `
        <p><strong>Name:</strong> ${teacher.name}</p>
        <p><strong>Department:</strong> ${teacher.department}</p>
        <p><strong>Subject:</strong> ${teacher.subject}</p>
        <p><small>ID: ${docSnap.id}</small></p>
      `;
      teacherListDiv.appendChild(teacherDiv);
    });
  };
})();
