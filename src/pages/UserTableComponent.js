import React, { useState, useEffect } from "react";
import styles from "../styles/usertable.module.css";
import { Switch } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";

import { Spin } from "antd";

const UserTableComponent = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const itemsPerPage = 10;
  const totalPages = Math.ceil(userData.length / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(1);

  const [activeUsers, setActiveUsers] = useState(
    userData.map((user) => user.active)
  );

  const toggleActive = (index) => {
    const updatedActiveUsers = [...activeUsers];
    updatedActiveUsers[index] = !updatedActiveUsers[index];
    setActiveUsers(updatedActiveUsers);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, userData.length);
  const visibleData = userData.slice(startIndex - 1, endIndex);

  const totalEntries = userData.length;

  const filteredData = userData.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchPost = async () => {
    setLoading(true);
    try {
      const newData = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      ).then((response) => response.json());

      setUserData(newData);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPost();
  }, []);
  return (
    <div className={styles.table_body}>
      <div className={styles.user_table_container}>
        <h2>User Table</h2>
        <div className={styles.spinner}>
          <Spin spinning={loading} tip="Loading..." />
        </div>
        <input
          className={styles.search_bar}
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <p>
          Showing <span className={styles.total_entries}>{totalEntries}</span>{" "}
          entries
        </p>
        {!loading && (
          <table className={`${styles.user_table} ${styles.box_shadow}`}>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" id="checkbox1" />
                </th>
                <th>User ID</th>
                <th>Post ID</th>
                <th>Title</th>
                <th>Body</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Website</th>
                <th>Company</th>
                <th></th>
                <th></th>
                <th className={styles.column}>...</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user, index) => {
                return (
                  <tr key={user.id} className={styles.table_data}>
                    <td>
                      <input type="checkbox" id="checkbox1" />
                    </td>
                    <td>{user?.id}</td>
                    <td>{user?.id}</td>
                    <td>{user?.name}</td>
                    <td>{user?.username}</td>
                    <td>{user?.name}</td>
                    <td>{user?.username}</td>
                    <td>{user?.email}</td>
                    <td>{user?.address?.street}</td>
                    <td>{user?.phone}</td>
                    <td>{user?.website}</td>
                    <td>{user?.company?.name}</td>

                    <td className={styles.add_button}>
                      <Switch
                        checked={activeUsers[index]}
                        onChange={() => toggleActive(index)}
                      />
                    </td>
                    <td>{<EditOutlined />}</td>
                    <td> {<DeleteOutlined />}</td>
                    <td>...</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <div className={styles.pagination}>
          <div className={styles.entries}>
            <p>{`Showing ${startIndex} to ${endIndex} of ${userData.length} entries`}</p>
          </div>
          <div className={styles.pagination_num}>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              {Array.from({ length: totalPages }, (_, index) => (
                <span
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  style={{
                    color: currentPage === index + 1 ? "purple" : "black",
                    cursor: "pointer",
                  }}
                >
                  {index + 1}
                </span>
              ))}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTableComponent;
