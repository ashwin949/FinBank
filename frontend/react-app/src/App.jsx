
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000/api";

function App() {
const [isLoggedIn, setIsLoggedIn] = useState(
!!localStorage.getItem("access_token")
);

const [username, setUsername] = useState(localStorage.getItem("username") || "");
const [password, setPassword] = useState("");

const [account, setAccount] = useState(null);
const [transactions, setTransactions] = useState([]);
const [activePage, setActivePage] = useState("dashboard");

const [depositAmount, setDepositAmount] = useState("");
const [withdrawAmount, setWithdrawAmount] = useState("");
const [transferAmount, setTransferAmount] = useState("");
const [recipient, setRecipient] = useState("");

const token = localStorage.getItem("access_token");
async function login() {
if (!username || !password) {
alert("Enter username and password");
return;
}

try {
const response = await fetch(`${API}/token/`, {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
username: username,
password: password,
}),
});

const data = await response.json();

if (!response.ok) {
alert("Invalid username or password");
return;
}

localStorage.setItem("access_token", data.access);
localStorage.setItem("username", username);
setIsLoggedIn(true);

window.location.reload();
} catch (error) {
alert("Unable to connect to FinBank server");
}
}

useEffect(() => {
if (token) {
loadAccount();
loadTransactions();
}
}, []);

async function loadAccount() {
try {
const response = await fetch(`${API}/accounts/`, {
headers: {
Authorization: `Bearer ${token}`,
},
});

const data = await response.json();

if (Array.isArray(data) && data.length > 0) {
setAccount(data[0]);
}
} catch (error) {
console.error("Account loading error:", error);
}
}

async function loadTransactions() {
try {
const response = await fetch(`${API}/transactions/`, {
headers: {
Authorization: `Bearer ${token}`,
},
});

const data = await response.json();

if (Array.isArray(data)) {
setTransactions(data);
}
} catch (error) {
console.error("Transaction loading error:", error);
}
}

async function depositMoney() {
if (!depositAmount || Number(depositAmount) <= 0) {
alert("Enter a valid amount");
return;
}

try {
const response = await fetch(`${API}/transactions/`, {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`,
},
body: JSON.stringify({
account: account.id,
transaction_type: "DEPOSIT",
amount: Number(depositAmount),
description: "Cash deposit",
}),
});

if (!response.ok) {
alert("Deposit failed");
return;
}

alert("Deposit successful");
setDepositAmount("");
await loadAccount();
await loadTransactions();
} catch (error) {
alert("Server error");
}
}

async function withdrawMoney() {
if (!withdrawAmount || Number(withdrawAmount) <= 0) {
alert("Enter a valid amount");
return;
}

try {
const response = await fetch(`${API}/transactions/`, {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`,
},
body: JSON.stringify({
account: account.id,
transaction_type: "WITHDRAWAL",
amount: Number(withdrawAmount),
description: "Cash withdrawal",
}),
});

if (!response.ok) {
alert("Withdrawal failed");
return;
}

alert("Withdrawal successful");
setWithdrawAmount("");
await loadAccount();
await loadTransactions();
} catch (error) {
alert("Server error");
}
}

async function transferMoney() {
if (
!transferAmount ||
Number(transferAmount) <= 0 ||
!recipient
) {
alert("Enter recipient account number and amount");
return;
}

try {
const response = await fetch(`${API}/transactions/`, {
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${token}`,
},
body: JSON.stringify({
account: account.id,
transaction_type: "TRANSFER",
amount: Number(transferAmount),
to_account: recipient,
description: "Money transfer",
}),
});

if (!response.ok) {
alert("Transfer failed");
return;
}

alert("Transfer successful");

setTransferAmount("");
setRecipient("");

await loadAccount();
await loadTransactions();
} catch (error) {
alert("Server error");
}
}

function setAmount(type, amount) {
if (type === "deposit") {
setDepositAmount(amount);
}

if (type === "withdraw") {
setWithdrawAmount(amount);
}

if (type === "transfer") {
setTransferAmount(amount);
}
}

function logout() {
localStorage.removeItem("access_token");
window.location.href = "/";
}

const balance = account ? Number(account.balance) : 0;
  
if (!isLoggedIn) {
return (
<div className="login-page">
<div className="login-card">

<img
src="/finbank-logo.png"
alt="FinBank"
className="login-logo"
/>

<h1>Welcome to FinBank</h1>

<p>Login to your personal banking account</p>

<input
type="text"
placeholder="Username"
value={username}
onChange={(e) => setUsername(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
/>

<button
className="primary-btn"
onClick={login}
>
Login
</button>

</div>
</div>
);
}
return (
<div className="app">

{/* HEADER */}
<header className="header">
<div className="logo-section">
<img
src="/finbank-logo.png"
alt="FinBank"
className="logo"
/>

<div>
<h2>FinBank</h2>
<span>Personal Banking</span>
</div>
</div>

<div className="header-right">
<span className="welcome">
Welcome, {username || "User"}
</span>

<button onClick={logout} className="logout-btn">
Logout
</button>
</div>
</header>

{/* NAVIGATION */}
<nav className="navbar">

<button
className={activePage === "dashboard" ? "active" : ""}
onClick={() => setActivePage("dashboard")}
>
Dashboard
</button>

<button
className={activePage === "statements" ? "active" : ""}
onClick={() => setActivePage("statements")}
>
Bank Statements
</button>

<button
className={activePage === "support" ? "active" : ""}
onClick={() => setActivePage("support")}
>
Support
</button>

</nav>

<main className="container">

{/* DASHBOARD */}
{activePage === "dashboard" && (
<>
<section className="hero">
  <div className="hero-content">
    <div>
      <p className="small-title">PERSONAL BANKING</p>
      <h1>Welcome to FinBank</h1>
      <p>
        Manage your money, transactions and banking services
        securely from one place.
      </p>
    </div>

    <div className="hero-badge">
      <span>●</span>
      Account Active
    </div>
  </div>
</section>

{/* ACCOUNT CARD */}
<section className="account-card">

<div>
<p>Available Balance</p>

<h1>
₹
{balance.toLocaleString("en-IN", {
minimumFractionDigits: 2,
})}
</h1>
</div>

<div className="account-details">
<span>Account Number</span>
<strong>
{account?.account_number || "Loading..."}
</strong>
</div>

</section>

{/* QUICK SERVICES */}
<section>
<h2>Quick Services</h2>

<div className="service-grid">

<button onClick={() => setActivePage("deposit")}>
<span>💰</span>
<strong>Deposit</strong>
<small>Add money to account</small>
</button>

<button onClick={() => setActivePage("withdraw")}>
<span>💸</span>
<strong>Withdraw</strong>
<small>Withdraw money</small>
</button>

<button onClick={() => setActivePage("transfer")}>
<span>↗</span>
<strong>Transfer</strong>
<small>Send money</small>
</button>

<button onClick={() => setActivePage("statements")}>
<span>📄</span>
<strong>Statements</strong>
<small>View transactions</small>
</button>

</div>
</section>

{/* RECENT TRANSACTIONS */}
<section className="transactions">

<div className="section-header">
<h2>Recent Transactions</h2>

<button
onClick={() => setActivePage("statements")}
className="view-btn"
>
View All
</button>
</div>

<TransactionTable
transactions={transactions.slice(0, 5)}
/>

</section>
</>
)}

{/* DEPOSIT */}
{activePage === "deposit" && (
<OperationCard
title="Deposit Money"
description="Add money to your FinBank account"
>
<AmountButtons
onSelect={(amount) =>
setAmount("deposit", amount)
}
/>

<input
type="number"
placeholder="Enter amount"
value={depositAmount}
onChange={(e) =>
setDepositAmount(e.target.value)
}
/>

<button
className="primary-btn"
onClick={depositMoney}
>
Deposit Money
</button>
</OperationCard>
)}

{/* WITHDRAW */}
{activePage === "withdraw" && (
<OperationCard
title="Withdraw Money"
description="Withdraw money from your account"
>
<AmountButtons
onSelect={(amount) =>
setAmount("withdraw", amount)
}
/>

<input
type="number"
placeholder="Enter amount"
value={withdrawAmount}
onChange={(e) =>
setWithdrawAmount(e.target.value)
}
/>

<button
className="primary-btn"
onClick={withdrawMoney}
>
Withdraw Money
</button>
</OperationCard>
)}

{/* TRANSFER */}
{activePage === "transfer" && (
<OperationCard
title="Transfer Money"
description="Send money to another FinBank account"
>

<input
type="text"
placeholder="Recipient account number"
value={recipient}
onChange={(e) =>
setRecipient(e.target.value)
}
/>

<AmountButtons
onSelect={(amount) =>
setAmount("transfer", amount)
}
/>

<input
type="number"
placeholder="Enter amount"
value={transferAmount}
onChange={(e) =>
setTransferAmount(e.target.value)
}
/>

<button
className="primary-btn"
onClick={transferMoney}
>
Transfer Money
</button>

</OperationCard>
)}

{/* STATEMENTS */}
{activePage === "statements" && (
<section>

<div className="page-title">
<h1>Bank Statements</h1>
<p>
View your complete transaction history.
</p>
</div>

<div className="statement-card">

<div className="statement-info">
<span>Account Number</span>
<strong>
{account?.account_number || "Loading..."}
</strong>
</div>

<div className="statement-info">
<span>Current Balance</span>
<strong>
₹
{balance.toLocaleString("en-IN", {
minimumFractionDigits: 2,
})}
</strong>
</div>

</div>

<TransactionTable
transactions={transactions}
/>

</section>
)}

{/* SUPPORT */}
{activePage === "support" && (
<section>

<div className="page-title">
<h1>FinBank Support</h1>
<p>
We're here to help with your banking needs.
</p>
</div>

<div className="support-grid">

<div className="support-card">
<h3>Frequently Asked Questions</h3>

<p>
How can I deposit money?
</p>

<p>
How can I transfer money?
</p>

<p>
Where can I view my transactions?
</p>

<p>
How can I contact FinBank support?
</p>
</div>

<div className="support-card">

<h3>Raise a Support Request</h3>

<input
type="text"
placeholder="Subject"
/>

<textarea
placeholder="Describe your issue"
rows="6"
></textarea>

<button
className="primary-btn"
onClick={() =>
alert("Support request submitted")
}
>
Submit Request
</button>

</div>

</div>

</section>
)}

</main>

<footer>
<p>© 2026 FinBank. Demo Banking Application.</p>
</footer>

</div>
);
}


/* OPERATION CARD */

function OperationCard({
title,
description,
children,
}) {
return (
<section className="operation-page">

<div className="page-title">
<h1>{title}</h1>
<p>{description}</p>
</div>

<div className="operation-card">
{children}
</div>

</section>
);
}


/* QUICK AMOUNT BUTTONS */

function AmountButtons({ onSelect }) {
const amounts = [
100,
200,
500,
1000,
10000,
100000,
];

return (
<div className="quick-amounts">

{amounts.map((amount) => (
<button
type="button"
key={amount}
onClick={() => onSelect(amount)}
>
₹{amount.toLocaleString("en-IN")}
</button>
))}

</div>
);
}


/* TRANSACTION TABLE */

function TransactionTable({ transactions }) {
if (!transactions.length) {
return (
<div className="empty">
No transactions found.
</div>
);
}

return (
<div className="table-container">

<table>

<thead>
<tr>
<th>Date</th>
<th>Type</th>
<th>Amount</th>
<th>Description</th>
</tr>
</thead>

<tbody>

{transactions.map((transaction) => (

<tr key={transaction.id}>

<td>
{transaction.created_at
? new Date(
transaction.created_at
).toLocaleDateString("en-IN")
: "-"}
</td>

<td>
<span
className={
transaction.transaction_type ===
"DEPOSIT"
? "deposit"
: transaction.transaction_type ===
"WITHDRAWAL"
? "withdraw"
: "transfer"
}
>
{transaction.transaction_type}
</span>
</td>

<td>
₹
{Number(transaction.amount).toLocaleString(
"en-IN",
{
minimumFractionDigits: 2,
}
)}
</td>

<td>
{transaction.description || "-"}
</td>

</tr>

))}

</tbody>

</table>

</div>
);
}

export default App;
