import React from "react";
import styles from "./styles.module.css";

function CacheCard({ data, action }) {
  return (
    <div onClick={action} className={styles.container}>
      <p>{Math.round(data[1]?.weather?.main?.temp)}º C</p>
      <p className={styles.city}>{data[1]?.weather?.name}</p>
    </div>
  );
}

export default CacheCard;
