import React, { useState, useEffect } from "react";
import styles from "../styles/usertable.module.css";
import { Switch } from "antd";
import { db, storage } from "../App";
import { collection, getDocs } from "firebase/firestore";
import { ref, list, listAll, getDownloadURL } from "firebase/storage";
import { Spin } from "antd";

const UserTableComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(1);

  const [imageURLs, setImageURLs] = useState([]);
  const [activeUsers, setActiveUsers] = useState(
    data.map((user) => user.active)
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
  const endIndex = Math.min(startIndex + itemsPerPage - 1, data.length);
  const visibleData = data.slice(startIndex - 1, endIndex);

  const totalEntries = data.length;

  const fetchImages = async () => {
    const storageRef = ref(storage, "images/");
    const result = await listAll(storageRef);

    const urlPromises = result.items.map((imageRef) =>
      getDownloadURL(imageRef)
    );

    try {
      const urls = await Promise.all(urlPromises);
      setImageURLs(urls);
    } catch (error) {
      console.error("Error retrieving image URLs", error);
    }
  };

  const fetchPost = async () => {
    setLoading(true);
    try {
      await getDocs(collection(db, "users")).then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setData(newData);
      });
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false); // Set loading to false whether successful or not
    }
  };
  useEffect(() => {
    fetchPost();
    fetchImages();
  }, []);

  return (
    <div className={styles.user_table_container}>
      <h2>User Table</h2>
      <div className={styles.spinner}>
        <Spin spinning={loading} tip="Loading..." />
      </div>
      <p>
        Showing <span className={styles.total_entries}>{totalEntries}</span>{" "}
        entries
      </p>
      {!loading && (
        <table className={styles.user_table}>
          <thead>
            <tr>
              <th>#</th>
              <th>EMAIL</th>
              <th>NAME</th>
              <th>PHONE NO</th>
              <th>INTERVIEW TIMINGS</th>
              <th>ROLE</th>
              <th>ACTIVE</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr key={user.id} className={styles.table_data}>
                <td>{index + 1}</td>
                <td>{user?.email}</td>
                <td className={styles.image_profile}>
                  {
                    <img
                      src={user.profileURL}
                      className={styles.profile_img}
                      width="20px"
                      height="20px"
                    />
                  }
                  {user?.username}
                </td>
                <td>{user?.phone}</td>
                <td>{user?.time}</td>
                <td>{user?.role}</td>
                <td className={styles.add_button}>
                  <Switch
                    checked={activeUsers[index]}
                    onChange={() => toggleActive(index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className={styles.pagination}>
        <div className={styles.entries}>
          <p>{`Showing ${startIndex} to ${endIndex} of ${data.length} entries`}</p>
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
  );
};

export default UserTableComponent;
