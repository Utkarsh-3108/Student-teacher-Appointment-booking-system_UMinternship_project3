// js/messages.js
(function () {
  const { collection, addDoc } = window.firebaseFns;

  window.sendMessage = async function sendMessage() {
    const receiverId = document.getElementById("msgReceiverId").value;
    const content = document.getElementById("msgContent").value;
    const senderId = auth.currentUser.uid;

    if (!receiverId || !content) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, 'messages'), {
        senderId,
        receiverId,
        content,
        timestamp: new Date()
      });
      logAction(senderId, "SEND_MESSAGE", `To: ${receiverId}`);
      alert("Message sent!");
      document.getElementById("msgReceiverId").value = "";
      document.getElementById("msgContent").value = "";
    } catch (err) {
      alert("Error sending message: " + err.message);
      console.error(err);
    }
  };
})();
