const User = require("../models/User");
const verify = require("../middlewares/authVerify");
const axios = require("axios");
const router = require("express").Router();

router.get("/allusers", verify, async (req, res) => {
  try {
    const results = await User.find().exec();
    res.send(results);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/travel/:city", verify, async (req, res) => {
  const city = req.params.city;

  const fetchedData = [{ user: req.user }];

  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${process.env.OPEN_WEATHER_SECRET}&units=metric`
    )
    .then(function (weather) {
      fetchedData.push({ weather: weather.data });

      const { country } = weather.data.sys;

      if (!country) {
        return res.status(404).send("No country found");
      }

      axios
        .get(
          `https://api.worldbank.org/v2/country/${country}/indicator/NY.GDP.MKTP.CD;NY.GDP.PCAP.CD;SP.POP.TOTL?source=2&mrv=1&format=json`
        )
        .then(function (countryData) {
          fetchedData.push({ country: countryData.data[1] });
          return res.status(200).json(fetchedData);
        })
        .catch(function (error) {
          JSON.stringify(error);
          const errorLog = {
            message: "Error fetching country data",
            error: error?.response?.data,
            fullError: error,
          };
          return res.status(400).json(errorLog);
        });
    })
    .catch(function (error) {
      const errorLog = {
        message: "Error fetching weather data",
        error: error?.response?.data,
        fullError: error,
      };
      return res.status(400).json(errorLog);
    });
});

module.exports = router;
