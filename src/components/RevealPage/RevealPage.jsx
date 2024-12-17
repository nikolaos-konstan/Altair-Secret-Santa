import { useState } from "react";
import { firestore, collection, getDocs } from "../../firebase";
import "./RevealPage.css";

function RevealPage() {
  const [userCode, setUserCode] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const querySnapshot = await getDocs(
        collection(firestore, "participants")
      );

      const matchedParticipant = querySnapshot.docs
        .map((doc) => doc.data())
        .find((participant) => participant.code === userCode);

      if (matchedParticipant) {
        setMessage(` ${matchedParticipant.secretSanta || "not yet assigned"}`);
      } else {
        setMessage("Code not found. Please check your code and try again!");
      }
    } catch (e) {
      console.error("Error fetching data:", e);
      setMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <form className="form-group" onSubmit={handleSubmit}>
          <h2 className="form-title">
            Enter your code to find out whose Secret Santa you are!
          </h2>
          <div className="form-row">
            <label htmlFor="code">Code:</label>
            <input
              type="text"
              id="code"
              name="code"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
            />
          </div>

          <button type="submit">
            &quot;I&apos;m the secret Santa of:&quot;
          </button>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
      <div className="image-container2">
        <img src="/images/secretSanta.png" alt="Secret Santa" />
      </div>
    </div>
  );
}

export default RevealPage;
