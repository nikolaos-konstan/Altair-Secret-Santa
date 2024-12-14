import { useState } from "react";
import { firestore, collection, addDoc } from "./firebase";
import { query, where, getDocs } from "firebase/firestore";
import "./App.css";

function App() {
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");

  const generateUniqueCode = async () => {
    let code;
    let isUnique = false;

    while (!isUnique) {
      code = Math.floor(1000 + Math.random() * 9000).toString();
      const q = query(
        collection(firestore, "participants"),
        where("code", "==", code)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        isUnique = true;
      }
    }

    return code;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName) {
      setMessage("Please enter your name!");
      return;
    }

    try {
      const q = query(
        collection(firestore, "participants"),
        where("name", "==", userName)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setMessage("You already are on the naughty list!");
        return;
      }

      const uniqueCode = await generateUniqueCode();
      await addDoc(collection(firestore, "participants"), {
        name: userName,
        code: uniqueCode,
      });

      setUserName("");

      setMessage(
        <>
          You have been added to the naughty list! Your code is{" "}
          <span style={{ color: "red" }}>{uniqueCode}</span>. Keep it secret!
        </>
      );
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
