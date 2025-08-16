// js/admin.js
(function () {
  const { collection, getDocs, query, where, updateDoc, doc } = window.firebaseFns;

  window.loadPendingStudents = async function loadPendingStudents() {
    const pendingDiv = document.getElementById("pending-students");
    if (!pendingDiv) return;

    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'student'),
        where('approved', '==', false)
      );
      const snap = await getDocs(q);

      pendingDiv.innerHTML = "";
      snap.forEach(docSnap => {
        const user = docSnap.data();
        const userDiv = document.createElement('div');
        userDiv.className = 'card';
        userDiv.innerHTML = `
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <div style="display:flex; gap:8px;">
            <button onclick="approveStudent('${docSnap.id}')">Approve</button>
          </div>
        `;
        pendingDiv.appendChild(userDiv);
      });
    } catch (err) {
      console.error("Error loading pending students:", err);
      alert("Failed to load pending students: " + err.message);
    }
  };

  window.approveStudent = async function approveStudent(userId) {
    try {
      await updateDoc(doc(db, 'users', userId), { approved: true });
      logAction(auth.currentUser.uid, "APPROVE_STUDENT", userId);
      alert("Student approved!");
      loadPendingStudents();
    } catch (err) {
      alert("Error approving student: " + err.message);
      console.error(err);
    }
  };
})();
