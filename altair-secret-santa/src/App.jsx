import { useState } from "react";
import { firestore, collection, addDoc } from "./firebase";
import { query, where, getDocs } from "firebase/firestore";
import "./App.css";

function App() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !userEmail) {
      setMessage("Please fill in both fields!");
      return;
    }

    try {
      // Check if the email already exists
      const q = query(
        collection(firestore, "participants"),
        where("email", "==", userEmail)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setMessage("This email is already on the naughty list!");
        return;
      }
      await addDoc(collection(firestore, "participants"), {
        name: userName,
        email: userEmail,
      });

      // Reset the form fields after successful submission
      setUserName("");
      setUserEmail("");

      setMessage("You have been added to the naughty list!");
    } catch (e) {
      console.error("Error adding document: ", e);
      setMessage("There was an error, please try again.");
    }
  };
  return (
    <div className="container">
      <div className="form-container">
        <form className="form-group" onSubmit={handleSubmit}>
          <h2 className="form-title">Secret Santa</h2>
          <div className="form-row">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="form-row">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)} // Update state
            />
          </div>
          <button type="submit">Enter the naughty list</button>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
      <div className="image-container">
        <img src="/images/santadiv.png" alt="Description" />
      </div>
    </div>
  );
}

export default App;
