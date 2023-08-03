import React from "react";
import styles from "./styles.module.css";
import Divider from "../Divider";

function Card({ type, blur, user, data }) {
  console.log("this is the type:", type);
  console.log("this is the USER:", user);

  const weatherConditions = [
    { id: 800, name: "Clear", img: "/assets/sunny.png" },
    { id: 2, name: "Thunderstorm", img: "/assets/lightning.png" },
    { id: 3, name: "Drizzle", img: "/assets/rainy.png" },
    { id: 5, name: "Rain", img: "/assets/rainy.png" },
    { id: 6, name: "Snow", img: "/assets/snow.png" },
    { id: 7, name: "Athmosphere", img: "/assets/cloudy.png" },
    { id: 801, name: "Clouds", img: "/assets/cloudy.png" },
  ];

  function milFormate(value) {
    var nf = new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      // maximumFractionDigits: 4,
    });
    return nf.format(value);
  }

  if (type === "weather") {
    return (
      <div className={styles.cardContainer}>
        <div>
          <h1 className={styles.weatherText}>
            {Math.round(data?.weather?.main?.temp)}º C
          </h1>
          <p>{data?.weather?.weather[0]?.main}</p>
        </div>
        {weatherConditions.map(
          (i) =>
            i.name === data?.weather?.weather[0]?.main && <img src={i.img} />
        )}
        {/* <img src={weatherConditions "/assets/sunny.png"} /> */}
        <Divider />
        <div>
          <h1>City</h1>
          <p>{data?.weather?.name}</p>
        </div>
        <Divider />
        <div>
          <h1>Country</h1>
          <p>{data?.weather?.sys?.country}</p>
        </div>
      </div>
    );
  }

  if (type === "country") {
    return (
      <div
        className={user?.length < 1 ? styles.blurEffect : styles.cardContainer}
      >
        <div>
          <h1 className={styles.weatherText}>
            {data?.country[1]?.indicator?.value}
          </h1>
          <p>{data?.country[1]?.value.toFixed(4)}</p>
        </div>

        <Divider />
        <div>
          <h1>{data?.country[2]?.indicator?.value}</h1>
          <p>
            {new Intl.NumberFormat("de-DE").format(data?.country[2]?.value)}
          </p>
        </div>
        <Divider />
        <div>
          <h1>{data?.country[0]?.indicator?.value}</h1>
          <p>{data?.country[0]?.value}</p>
        </div>
      </div>
    );
  }
}

export default Card;
