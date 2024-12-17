import { useState, useEffect } from "react";
import { firestore, collection, addDoc } from "../../firebase";
import { query, where, getDocs } from "firebase/firestore";
import "./DrawPage.css";
import whiteTower from "/images/white-tower.svg";
import parthenon from "/images/parthenon.svg";

function DrawPage() {
  const [userName, setUserName] = useState("");
  const [city, setCity] = useState("Thess");
  const [message, setMessage] = useState("");
  const [hasDrawn, setHasDrawn] = useState(false); // Track if draw has happened

  useEffect(() => {
    const checkHasDrawn = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(firestore, "participants")
        );
        const hasSecretSanta = querySnapshot.docs.some(
          (doc) => doc.data().secretSanta
        );
        setHasDrawn(hasSecretSanta);
      } catch (e) {
        console.error("Error checking if draw has happened: ", e);
      }
    };
    checkHasDrawn();
  }, []);
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

    if (hasDrawn) {
      setMessage("You didn't make it on the naughty list on time!");
      return;
    }

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
        city: city,
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
          <h2 className="form-title">Become a Secret Santa!</h2>
          <div className="form-row">
            <label htmlFor="city">City:</label>
            <div className="toggle-container">
              <div
                className={`toggle-option ${
                  city === "Thess" ? "selected" : ""
                }`}
                onClick={() => setCity("Thess")}
              >
                <img src={whiteTower} alt="Thessaloniki" />
              </div>
              <div
                className={`toggle-option ${
                  city === "Athens" ? "selected" : ""
                }`}
                onClick={() => setCity("Athens")}
              >
                <img src={parthenon} alt="Athens" />
              </div>
            </div>
          </div>
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

export default DrawPage;
