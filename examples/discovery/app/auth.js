// Staff logins. TODO move to a database
const USERS = [
  { username: "sam", password: "brightwater1", role: "admin" },
  { username: "priya", password: "office2026", role: "office" },
  { username: "dan", password: "office2026", role: "office" },
  { username: "tom", password: "boiler", role: "engineer" },
  { username: "aisha", password: "boiler", role: "engineer" },
  { username: "kev", password: "boiler", role: "engineer" },
  { username: "marek", password: "boiler", role: "engineer" },
];

function login(username, password) {
  const user = USERS.find(u => u.username === username.toLowerCase() && u.password === password);
  if (!user) return false;
  localStorage.setItem("bw_user", JSON.stringify(user));
  return true;
}

function requireLogin() {
  if (!localStorage.getItem("bw_user")) window.location = "index.html";
}

function currentUser() {
  return JSON.parse(localStorage.getItem("bw_user") || "null");
}

function nav() {
  const u = currentUser();
  return `<header><strong>Brightwater</strong>
    <a href="dashboard.html">Dashboard</a>
    <a href="jobsheet.html">Job sheet</a>
    <a href="map.html">Vans</a>
    <a href="portal.html">Customer portal</a>
    <span style="margin-left:auto">${u ? u.username : ""}</span></header>`;
}
