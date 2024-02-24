import React, { useState, useEffect } from "react";
import styles from "../styles/userForm.module.css";
import { Switch } from "antd";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../App";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { v4 } from "uuid";

const UserFormComponent = () => {
  const [formData, setFormData] = useState({
    profilePicture: null,
    userName: "",
    email: "",
    number: "",
    timeOfDay: "Morning",
    role: "Student",
  });
  const [url, setUrl] = useState("");
  const [imageUpload, setImageUpload] = useState(null);

  const addTodo = async (obj) => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        ...obj,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const uploadFile = () => {
    const imageRef = storageRef(storage, `/files/${formData.email}`);

    uploadBytes(imageRef, formData.profilePicture)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            console.log(url);
            setUrl(url);
            addTodo({
              email: formData.email,
              phone: formData.number,
              role: formData.role,
              time: formData.timeOfDay,
              username: formData.userName,
              profileURL: url,
            });
          })
          .catch((error) => {
            alert(error.message);
          });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const [activeButton, setActiveButton] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePicture: file });
  };

  const handleToggleChange = () => {
    setFormData({
      ...formData,
      role: formData.role === "Student" ? "Teacher" : "Student",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clear all fields after form submission

    uploadFile();

    setFormData({
      profilePicture: null,
      userName: "",
      email: "",
      number: "",
      timeOfDay: "Morning",
      role: "Student",
    });
    // Implement your form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className={styles.form_div}>
      <p>User Form</p>
      <form onSubmit={handleSubmit}>
        <div className={styles.file_input}>
          <label htmlFor="profilePicture">Upload Profile Picture:</label>
          <div className={styles.file_upload}>
            <input
              className={styles.files}
              type="file"
              id="profilePicture"
              name="profilePicture"
              onChange={handleFileChange}
            />
          </div>
          <label htmlFor="profilePicture">PNG, JPEG, JPG</label>
        </div>

        <div className={`${styles.form_row} ${styles.columns}`}>
          <div className={styles.input_fields}>
            <label htmlFor="userName">User Name:</label>
            <div>
              <input
                className={styles.field}
                type="text"
                id="userName"
                name="userName"
                placeholder="Enter username"
                value={formData.userName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div></div>
          <div className={styles.input_fields}>
            <label htmlFor="email">Email:</label>
            <div>
              <input
                className={styles.fields}
                type="email"
                id="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className={styles.form_row}>
          <div className={styles.input_fields}>
            <label htmlFor="number">Enter your phone number:</label>
            <div>
              <input
                className={styles.field}
                type="number"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className={styles.input_fields}>
            <label htmlFor="timeOfDay">Select Time of Day:</label>
            <div>
              <select
                className={styles.fields}
                id="timeOfDay"
                name="timeOfDay"
                value={formData.timeOfDay}
                onChange={handleInputChange}
              >
                <option className={styles.time} value="Morning">
                  Morning
                </option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <div className={styles.switch_btn}>
            <Switch />
            <label>Select Your Role(optional)</label>
          </div>
        </div>
        <div className={styles.user_roles}>
          <div className={styles.roles}>
            <input
              className={styles.radio_btn}
              type="radio"
              name="role"
              value="Student"
              checked={formData.role === "Student"}
              onChange={handleInputChange}
            />
            <label className={styles.radio_btn}>Student</label>
            <input
              className={styles.radio_btn}
              type="radio"
              name="role"
              value="Teacher"
              checked={formData.role === "Teacher"}
              onChange={handleInputChange}
            />
            <label className={styles.radio_btn}>Teacher</label>
            <input
              className={styles.radio_btn}
              type="radio"
              name="role"
              value="Other"
              checked={formData.role === "Other"}
              onChange={handleInputChange}
            />
            <label className={styles.radio_btn}>Other</label>
          </div>
        </div>

        <div className={styles.submit_btn}>
          <button className={styles.btn} type="submit">
            Add User
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserFormComponent;
