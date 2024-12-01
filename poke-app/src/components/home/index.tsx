import React, { useState, useEffect } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import "./home.css";
import Papa from "papaparse";
import { getAuth } from "firebase/auth";

interface Contact {
  id?: string;
  name: string;
  company: string;
  lastContacted: string;
  photo?: string | null;
  phone?: string;
  email?: string;
  linkedin?: string;
  notes?: string;
}

// switch to development host and server port (see .env) for local use 
const host = process.env.REACT_APP_PROD_HOST || "error";

const Home = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContactIndex, setSelectedContactIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  const currentContact = contacts[selectedContactIndex];

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [lastContacted, setLastContacted] = useState(new Date().toISOString().split("T")[0]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [notes, setNotes] = useState("");
  const auth = getAuth();

  const fetchToken = async () => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      console.log(token); // Firebase JWT
      return token;
    }
    return null;
  };

  fetchToken();

  axios.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.error('No user is logged in. Request is being sent without a token.');
    }
    return config;
  });

  useEffect(() => {
    const shouldFetchContacts =
      contacts.length === 0 || selectedContactIndex >= contacts.length - 5;
  
    if (shouldFetchContacts) {
      axios
        .get(host + "/contacts")
        .then((response: AxiosResponse) => {
          setContacts((prevContacts) => [...prevContacts, ...response.data]); // Append new contacts
        })
        .catch((error: AxiosError) => {
          console.error("Error fetching contacts:", error);
        });
    }
  }, [selectedContactIndex, contacts, host]);
  
  

  const handlePoke = () => {
    if (!currentContact) {
      return;
    }

    setShowContactModal(true);

    const updatedContact: Contact = {
      ...currentContact,
      lastContacted: new Date().toISOString().split("T")[0],
    };

    const updatedContacts = [...contacts];
    updatedContacts[selectedContactIndex] = updatedContact;

    setContacts(updatedContacts);

    axios
      .put(host + "/contacts/" + currentContact.id, updatedContact)
      .catch((error : AxiosError) => {
        console.error("Error updating contact:", error);
      });
  };

  const handlePass = () => {
    setSelectedContactIndex((prevIndex) => (prevIndex + 1 < contacts.length ? prevIndex + 1 : 0));
    setShowContactModal(false);
  };

  const handleAddContact = (event: React.FormEvent) => {
    event.preventDefault();

    const newContact: Omit<Contact, 'id'> = {
      name: name,
      company: company,
      lastContacted: lastContacted,
      photo: photo,
      phone: phone,
      email: email,
      linkedin: linkedin,
      notes: notes,
    };

    axios
      .post(host + "/contacts", newContact)
      .then((response : AxiosResponse) => {
        setContacts([response.data, ...contacts]);
        setName("");
        setCompany("");
        setLastContacted(new Date().toISOString().split("T")[0]);
        setPhoto(null);
        setPhone("");
        setEmail("");
        setLinkedin("");
        setNotes(""); // Reset notes
        setShowAddContactModal(false);
      })
      .catch((error : AxiosError) => {
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
    setSelectedContactIndex((prevIndex) => (prevIndex + 1 < contacts.length ? prevIndex + 1 : 0));
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      interface CSVRow {
        [key: string]: string;
      }

      interface Contact {
        name: string;
        company: string;
        lastContacted: string;
        photo: string | null;
        phone: string;
        email: string;
        linkedin: string;
      }
    
      let hasReachedHeader = false;
      const batchedContacts: Contact[] = [];
      Papa.parse(file, {
        skipEmptyLines: true, // Skip empty lines
        step: function (row, parser) {
          type CSVRow = Record<string, string>;
          const rowData = row.data as CSVRow; // Explicitly cast to the CSVRow type
          const rowKeys = Object.keys(rowData);
          console.log("Processing row:", rowData);
          console.log("Row keys:", Object.keys(rowData));

          if (!hasReachedHeader) {
            if (rowData["0"]?.trim() === "First Name") {
              hasReachedHeader = true;
              console.log("Header row detected:", rowData);
              return; // Skip the header row
            }
            return; // Skip rows before the header
          }
          const importedContact: Contact = {
            name: `${rowData["0"]} ${rowData["1"]}`,
            company: rowData["4"] || "",
            lastContacted: rowData["6"] || "",
            photo: null,
            phone: "",
            email: rowData["3"] || "",
            linkedin: rowData["2"] || "",
          };
      
          console.log("Adding contact:", importedContact);
          batchedContacts.push(importedContact); // Add the contact to the batch

        },
        complete: () => {
          console.log("Parsing complete. Sending batch to the server...");
      
          // Now send the batched contacts to the server
          axios
            .post(host + "/contacts/batch", { contacts: batchedContacts }) // Wrap the array in an object if your backend expects it
            .then((response: AxiosResponse) => {
              console.log("Batch contacts added:", response.data);
              setContacts((prevContacts) => [...response.data, ...prevContacts]);
            })
            .catch((error: AxiosError) => {
              console.error("Error adding contacts in batch:", error);
            });
        },
      });
      
      
    }
  };  

  return (
    <div className="page-container">
      <header className="app-header">
        <h1 className="app-title">Poke</h1>
      </header>
      <div className="app-container">
        <div className="button-group">
          <button className="add-contact-button" onClick={() => setShowAddContactModal(true)}>
            Add Contact
          </button>
          <label className="import-label">
            Import Connections from CSV
            <input type="file" accept=".csv" onChange={handleImportCSV} className="form-input csv-input" />
          </label>
        </div>
        {currentContact && (
          <div className="contact-item">
              <img
              src={'/chill_guy.jpeg'}
              alt={`${currentContact.name}'s photo`}
                className="contact-photo"
              />
            <div className="contact-details">
              <h2>{currentContact.name}</h2>
              <p>{currentContact.company}</p>
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
          </div>
        )}
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
              {currentContact.notes &&   
              <li>
                <strong>Notes:</strong>
                <div className="notes">{currentContact.notes}</div>
              </li>}
            </ul>
            <button className="close-modal-button" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {showAddContactModal && (
        <div className="modal-overlay" onClick={() => setShowAddContactModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Contact</h3>
            <form onSubmit={handleAddContact}>
              <div className="form-fields">
                <div className="form-field">
                  <label className="form-label">Name</label>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Company</label>
                  <input
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Last Contacted</label>
                  <input
                    type="date"
                    value={lastContacted}
                    onChange={(event) => setLastContacted(event.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Photo</label>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="form-input" />
                </div>
                <div className="form-field">
                  <label className="form-label">Phone</label>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Email</label>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">LinkedIn URL</label>
                  <input
                    value={linkedin}
                    onChange={(event) => setLinkedin(event.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className="form-input"
                    rows={3}
                  />
                </div>
              </div>
              <div className="button-group">
                <button type="submit" className="submit-button">Add Contact</button>
                <button type="button" className="close-modal-button" onClick={() => setShowAddContactModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;