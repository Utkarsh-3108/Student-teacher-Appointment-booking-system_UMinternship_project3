// js/auth.js
(function () {
  const {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    doc, getDoc, setDoc
  } = Object.assign({}, window.firebaseFns, {
    // pull doc/getDoc/setDoc from firebaseFns if present
    doc: window.firebaseFns?.doc,
    getDoc: window.firebaseFns?.getDoc,
    setDoc: window.firebaseFns?.setDoc
  });

  async function setUserDoc(uid, { name, email, role }) {
    await setDoc(doc(db, 'users', uid), {
      name, email, role,
      approved: role === 'student' ? false : true,
      createdAt: new Date()
    });
  }

  async function getCurrentUserData() {
    const snap = await getDoc(doc(db, 'users', auth.currentUser.uid));
    return snap.exists() ? snap.data() : null;
  }

  window.registerUser = async function registerUser() {
    try {
      console.log("Register function called");
      const name = document.getElementById("regName").value;
      const email = document.getElementById("regEmail").value;
      const password = document.getElementById("regPassword").value;
      const role = document.getElementById("regRole").value;

      if (!name || !email || !password) {
        alert("Please fill all fields");
        return;
      }
      if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created:", cred.user.uid);

      await setUserDoc(cred.user.uid, { name, email, role });

      logAction(cred.user.uid, "REGISTER_USER", `Role: ${role}`);
      alert("Registration successful! " + (role === 'student' ? "Please wait for admin approval." : "You can login now."));
      window.location.href = "index.html";
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed: " + err.message);
      logAction("SYSTEM", "REGISTER_ERROR", err.message);
    }
  };

  window.loginUser = async function loginUser() {
    try {
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      if (!email || !password) {
        alert("Please enter email and password");
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
      logAction(auth.currentUser.uid, "LOGIN", "User logged in");

      const userData = await getCurrentUserData();
      if (!userData) {
        alert("User data not found");
        return;
      }

      if (userData.role === 'student' && !userData.approved) {
        alert("Your account is pending admin approval");
        await signOut(auth);
        return;
      }

      if (userData.role === 'student') {
        window.location.href = 'student-dashboard.html';
      } else if (userData.role === 'teacher') {
        window.location.href = 'teacher-dashboard.html';
      } else if (userData.role === 'admin') {
        window.location.href = 'admin-dashboard.html';
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed: " + err.message);
      logAction("SYSTEM", "LOGIN_ERROR", err.message);
    }
  };

  window.logoutUser = async function logoutUser() {
    await signOut(auth);
    logAction(auth.currentUser?.uid || "SYSTEM", "LOGOUT", "User logged out");
    window.location.href = 'index.html';
  };

  onAuthStateChanged(auth, (user) => {
    const currentPage = window.location.pathname;
    const isDashboardPage = currentPage.includes('dashboard');
    if (isDashboardPage && !user) {
      alert("Please login to access this page");
      window.location.href = 'index.html';
    }
  });
})();
