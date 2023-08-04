// "use client";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import nookies from "nookies";
import { http } from "./api/http";
import { deleteCookies } from "../lib/session";
import Router from "next/router";
import { message } from "antd";
import { useState } from "react";
import Card from "../components/Card";
import CacheCard from "../components/CacheCard";

function Home(ctx) {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchInput, setsearchInput] = useState("");
  const [fetchedData, setFetchedData] = useState([]);
  const [cache, setCache] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Pesquise para exibir dados"
  );

  const handleLogout = async () => {
    await deleteCookies();
    Router.reload();
    messageApi.open({
      type: "warning",
      content: "Your session has ended.",
    });
  };

  const onSearch = async () => {
    if (!searchInput) {
      return;
    }
    setErrorMessage("Buscando...");
    http
      .get(`dashboard/travel/${searchInput}`)
      .then((response) => {
        const allData = response.data;
        setFetchedData(allData);
        const tmpArray = cache;
        tmpArray.push(allData);
        setCache(tmpArray.reverse());
        setsearchInput("");

        messageApi.open({
          type: "success",
          content: "Redirecting to app",
        });

        Router.replace("/");
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content:
            error?.response?.data ?? "Error fetching data. Please try again, ",
        });
        setErrorMessage(
          error?.response?.data ?? "Error fetching data. Please try again"
        );
      })
      .finally(() => setLoading(false));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSearch();
    }
  };

  const handleCacheSelection = (item) => {
    setFetchedData(item);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Xplore</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.nav}>
          <h2>Xplore</h2>
          <div className={styles.navSessionContainer}>
            {ctx?.props?.username ? (
              <>
                <p>{ctx?.props?.username}</p>
                <button className={styles.navButton} onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <button
                className={styles.navButton}
                onClick={() => Router.push("/login")}
              >
                Login
              </button>
            )}
          </div>
        </div>
        <div className={styles.hero_container}>
          <section className={styles.leftSection}>
            <h1>Travel assistance</h1>
            <p>
              Unleash the explorer within you and discover the world's most
              enchanting destinations.
            </p>
            <div className={styles.searchContainer}>
              <input
                onKeyDown={handleKeyDown}
                value={searchInput}
                onChange={(e) => setsearchInput(e.currentTarget.value)}
                placeholder="search for a city, ex: Maputo"
              />
              <button onClick={onSearch}>Search</button>
            </div>
            <div className={styles.cacheContainer}>
              {cache.map((i, index) => (
                <CacheCard
                  key={"cache" + index}
                  data={i}
                  action={() => handleCacheSelection(i)}
                />
              ))}
            </div>
          </section>
          <section className={styles.rightSection}>
            {fetchedData.length < 1 && <h1>{errorMessage}</h1>}
            {fetchedData.map((i, index) => {
              return (
                !Object.keys(i).includes("user") && (
                  <Card
                    key={Object.keys(i)[0] + index + Date.now()}
                    type={Object.keys(i)[0]}
                    data={i}
                    user={ctx.props.username ?? ""}
                  />
                )
              );
            })}
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by paichato
        </a>
      </footer>
    </div>
  );
}

Home.getInitialProps = async (ctx) => {
  const { "xplore.token": token } = nookies.get(ctx);

  if (!token) return { props: { username: null } };

  const response = await http
    .get("/validate-user", { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => {
      http.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      res.data.session = "active";

      return res.data;
    })
    .catch((err) => {});

  if (!response) return { props: { username: null } };
  return { props: response };
};

export default Home;
