// js/logger.js
(function () {
  const { collection, addDoc } = window.firebaseFns;

  window.logAction = async function logAction(userId, action, details) {
    const logEntry = {
      userId: userId || "Anonymous",
      action,
      details,
      timestamp: new Date().toISOString()
    };
    console.log(`[LOG] ${logEntry.timestamp} - ${action}: ${details}`);
    try {
      await addDoc(collection(db, 'logs'), logEntry);
      console.log("Log stored successfully");
    } catch (err) {
      console.error("Log error:", err);
    }
  };
})();
