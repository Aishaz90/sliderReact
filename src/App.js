import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const flagContainerRef = useRef(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countriesWithoutIsrael = response.data.filter(
          (country) => country.name.common !== "Israel"
        );
        setCountries(countriesWithoutIsrael);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  const onMouseDown = (e) => {
    setDragging(true);
    setStartX(e.clientX);
  };

  const onMouseMove = (e) => {
    if (!dragging) return;

    const deltaX = e.clientX - startX;
    setCurrentX(deltaX);
  };

  const onMouseUp = () => {
    setDragging(false);
    if (currentX > 100) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % countries.length);
    } else if (currentX < -100) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + countries.length) % countries.length
      );
    }
  };

  const nextFlag = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % countries.length);
  };

  const prevFlag = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + countries.length) % countries.length
    );
  };

  return (
    <div className="App">
      <header className="header">
        <img src="/logo-removebg-preview.png" alt="Logo" />
      </header>

      <main>
        {countries.length === 0 ? (
          <p>Loading flags...</p>
        ) : (
          <>
            <video autoPlay muted loop id="myVideo">
              <source src="/myvid.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="slider">
              <button className="prev" onClick={prevFlag}>
                ◀
              </button>

              <div
                className="flag-container-wrapper"
                style={{
                  transform: `rotateY(${currentIndex * -120}deg)`, // Rotate carousel
                }}
              >
                <div
                  className="flag-container"
                  ref={flagContainerRef}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseUp}
                >
                  <img
                    src={countries[currentIndex].flags.png}
                    alt={countries[currentIndex].name.common}
                    className="flag"
                  />
                  <h2>{countries[currentIndex].name.common}</h2>
                  <p>Region: {countries[currentIndex].region}</p>
                </div>

                <div
                  className="flag-container"
                  style={{
                    transform: "rotateY(120deg) translateZ(500px)", // Further separation
                  }}
                >
                  <img
                    src={countries[(currentIndex + 1) % countries.length].flags.png}
                    alt={countries[(currentIndex + 1) % countries.length].name.common}
                    className="flag"
                  />
                  <h2>{countries[(currentIndex + 1) % countries.length].name.common}</h2>
                  <p>Region: {countries[(currentIndex + 1) % countries.length].region}</p>
                </div>

                <div
                  className="flag-container"
                  style={{
                    transform: "rotateY(-120deg) translateZ(500px)", // Further separation
                  }}
                >
                  <img
                    src={countries[(currentIndex - 1 + countries.length) % countries.length].flags.png}
                    alt={countries[(currentIndex - 1 + countries.length) % countries.length].name.common}
                    className="flag"
                  />
                  <h2>{countries[(currentIndex - 1 + countries.length) % countries.length].name.common}</h2>
                  <p>Region: {countries[(currentIndex - 1 + countries.length) % countries.length].region}</p>
                </div>
              </div>

              <button className="next" onClick={nextFlag}>
                ▶
              </button>
            </div>
          </>
        )}
      </main>

      <footer>
        <h4>A dynamic platform to explore and discover flags of countries worldwide, symbolizing global wanderlust and cultural exploration.</h4>
      </footer>
    </div>
  );
}

export default App;
