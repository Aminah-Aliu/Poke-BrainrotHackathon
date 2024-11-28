import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

type Contact = {
  id: string;
  name: string;
  location: string;
  lastContacted: string;
  photo: string | null;
  phone: string;
  email: string;
  linkedin: string;
};

const serverPort = "5001";

const App = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactIndex, setSelectedContactIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  const currentContact = contacts[selectedContactIndex];

  // States for form input fields
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [lastContacted, setLastContacted] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [photo, setPhoto] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");

  useEffect(() => {
    // Fetch contacts from backend
    axios
      .get("http://localhost:" + serverPort+ "/contacts")
      .then((response) => {
        setContacts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
      });
  }, []);

  const handlePoke = () => {
    if (!currentContact) {
      return;
    }

    // Show the contact modal
    setShowContactModal(true);

    // Update last contacted date
    const updatedContact: Contact = {
      ...currentContact,
      lastContacted: new Date().toISOString().split("T")[0], // Update to today's date
    };

    const updatedContacts = [...contacts];
    updatedContacts[selectedContactIndex] = updatedContact;

    setContacts(updatedContacts);

    const contactToSend = updatedContact;
    contactToSend.photo = null;
    // Optionally send an update request to the backend to save the changes
    axios
      .put(`http://localhost:" + serverPort +"/contacts/${currentContact.id}`, updatedContact)
      .catch((error) => {
        console.error("Error updating contact:", error);
      });
  };

  const handlePass = () => {
    // Move to the next contact
    setSelectedContactIndex((prevIndex) =>
      prevIndex + 1 < contacts.length ? prevIndex + 1 : 0
    );
    setShowContactModal(false); // Hide modal for the new contact
  };

  const handleAddContact = (event: React.FormEvent) => {
    event.preventDefault();

    // Create a new contact object
    const newContact: Omit<Contact, 'id'> = {
      name: name,
      location: location,
      lastContacted: lastContacted,
      photo: photo,
      phone: phone,
      email: email,
      linkedin: linkedin,
    };
    const contactToSend = newContact;
    contactToSend.photo = null;
    // Add the new contact to the backend
    axios
      .post("http://localhost:" + serverPort + "/contacts", contactToSend)
      .then((response) => {
        // Add the new contact to the contacts array
        setContacts([response.data, ...contacts]);

        // Clear the input fields
        setName("");
        setLocation("");
        setLastContacted(new Date().toISOString().split("T")[0]);
        setPhoto(null);
        setPhone("");
        setEmail("");
        setLinkedin("");
      })
      .catch((error) => {
        console.error("Error adding contact:", error);
      });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setPhoto(e.target.result as string);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleCloseModal = () => {
    setShowContactModal(false);
  };

  return (
    <div className="page-container">
      <header className="app-header">
        <h1 className="app-title">Poke</h1>
      </header>
      <div className="app-container">
        <div className="form-container">
          <form className="contact-form" onSubmit={handleAddContact}>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Name"
              required
            />
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Location"
              required
            />
            <input
              value={lastContacted}
              onChange={(event) => setLastContacted(event.target.value)}
              placeholder="Last Contacted (YYYY-MM-DD)"
              required
            />
            <input type="file" accept="image/*" onChange={handlePhotoUpload} />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Phone"
            />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
            />
            <input
              value={linkedin}
              onChange={(event) => setLinkedin(event.target.value)}
              placeholder="LinkedIn URL"
            />
            <button type="submit">Add Contact</button>
          </form>
        </div>
        <div className="contact-display">
          {currentContact && (
            <div key={currentContact.id} className="contact-item">
              {currentContact.photo && (
                <img
                  src={currentContact.photo}
                  alt={`${currentContact.name}'s photo`}
                  className="contact-photo"
                />
              )}
              <h2>{currentContact.name}</h2>
              <p>Location: {currentContact.location}</p>
              <p>Last Contacted: {currentContact.lastContacted}</p>
              <div className="action-buttons">
                <button className="poke-button" onClick={handlePoke}>
                  Poke
                </button>
                <button className="pass-button" onClick={handlePass}>
                  Pass
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showContactModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Contact Methods for {currentContact.name}</h3>
            <ul className="contact-methods">
              {currentContact.phone && (
                <li>
                  <strong>Phone:</strong> {currentContact.phone}
                </li>
              )}
              {currentContact.email && (
                <li>
                  <strong>Email:</strong> {currentContact.email}
                </li>
              )}
              {currentContact.linkedin && (
                <li>
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    href={currentContact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {currentContact.linkedin}
                  </a>
                </li>
              )}
            </ul>
            <button className="close-modal-button" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
