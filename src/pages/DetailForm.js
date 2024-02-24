import React, { useState } from "react";
import styles from "../styles/userForm.module.css";
import UserFormComponent from "./UserFormComponent";
import UserTableComponent from "./UserTableComponent";

const DetailForm = () => {
  const [formData, setFormData] = useState({
    profilePicture: null,
    userName: "",
    email: "",
    number: "",
    timeOfDay: "Morning",
    role: "Student",
  });

  const [activeButton, setActiveButton] = useState("User Form");
  const [hideSideBar, setHideSideBar] = useState(true);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

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
    <div className={styles.main}>
      <div className={styles.button_div}>
        <div className={styles.group_icon}>
          <img
            src="/Group.png"
            alt="User Form Icon"
            className={styles.icon}
            onClick={() => setHideSideBar(!hideSideBar)}
          />
        </div>

        {hideSideBar && (
          <>
            <div
              className={
                activeButton == "User Form"
                  ? styles.user_from_btn_active
                  : styles.user_from_btn_inactive
              }
              onClick={() => setActiveButton("User Form")}
            >
              <img
                src="/Vector.png"
                alt="User Form Icon"
                className={styles.icon}
              />
              <button className={`${styles.buttonStyle}`}>User Form</button>
            </div>
            <div
              className={
                activeButton == "User Table"
                  ? styles.user_from_btn_active
                  : styles.user_from_btn_inactive
              }
              onClick={() => setActiveButton("User Table")}
            >
              <img
                src="/Vector-1.png"
                alt="User Form Icon"
                className={styles.icon}
              />
              <button className={`${styles.buttonStyle}`}>User Table</button>
            </div>
          </>
        )}
      </div>

      {activeButton == "User Table" && <UserTableComponent />}
      {activeButton == "User Form" && <UserFormComponent />}
    </div>
  );
};

export default DetailForm;
