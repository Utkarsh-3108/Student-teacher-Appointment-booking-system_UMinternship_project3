// js/appointments.js
(function () {
  const { collection, addDoc, updateDoc, doc, getDocs, query, where } = window.firebaseFns;

  window.bookAppointment = async function bookAppointment() {
    const teacherId = document.getElementById("bookTeacherId").value;
    const datetime = document.getElementById("bookDateTime").value;
    const reason = document.getElementById("bookReason").value;
    const studentId = auth.currentUser.uid;

    if (!teacherId || !datetime || !reason) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, 'appointments'), {
        studentId, teacherId, datetime, reason,
        status: "PENDING",
        createdAt: new Date()
      });
      logAction(studentId, "BOOK_APPOINTMENT", `Teacher: ${teacherId}`);
      alert("Appointment booked successfully!");
      document.getElementById("bookTeacherId").value = "";
      document.getElementById("bookDateTime").value = "";
      document.getElementById("bookReason").value = "";
    } catch (err) {
      alert("Error booking appointment: " + err.message);
      console.error(err);
    }
  };

  window.approveAppointment = async function approveAppointment(appointmentId) {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status: "APPROVED",
        approvedAt: new Date()
      });
      logAction(auth.currentUser.uid, "APPROVE_APPOINTMENT", appointmentId);
      alert("Appointment approved!");
      loadTeacherAppointments();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  window.cancelAppointment = async function cancelAppointment(appointmentId) {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status: "CANCELLED",
        cancelledAt: new Date()
      });
      logAction(auth.currentUser.uid, "CANCEL_APPOINTMENT", appointmentId);
      alert("Appointment cancelled!");
      loadTeacherAppointments();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  window.loadTeacherAppointments = async function loadTeacherAppointments() {
    const appointmentsDiv = document.getElementById("appointments");
    if (!appointmentsDiv) return;

    const q = query(collection(db, 'appointments'), where('teacherId', '==', auth.currentUser.uid));
    const snap = await getDocs(q);

    appointmentsDiv.innerHTML = "";
    snap.forEach(docSnap => {
      const appointment = docSnap.data();
      const appointmentDiv = document.createElement('div');
      appointmentDiv.className = 'card';
      appointmentDiv.innerHTML = `
        <p><strong>Date:</strong> ${appointment.datetime}</p>
        <p><strong>Reason:</strong> ${appointment.reason}</p>
        <p><strong>Status:</strong> ${appointment.status}</p>
      `;
      appointmentsDiv.appendChild(appointmentDiv);
    });
  };
})();
