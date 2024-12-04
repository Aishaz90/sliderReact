import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [rotation, setRotation] = useState(0); // The current rotation of the flag
  const flagContainerRef = useRef(null); // Ref to access the flag container

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
    setStartX(e.clientX); // Store where the drag starts
  };

  const onMouseMove = (e) => {
    if (!dragging) return;

    const deltaX = e.clientX - startX; // Calculate how much the mouse has moved
    setCurrentX(deltaX); // Track the current drag position
    setRotation(deltaX / 5); // Control the rotation speed (smaller divisor = faster rotation)
  };

  const onMouseUp = () => {
    setDragging(false); // Stop dragging
    setRotation(0); // Reset rotation when dragging ends

    // Decide whether to flip to the next or previous flag based on drag direction
    if (currentX > 100) {
      // Dragged enough to flip to the next flag
      setCurrentIndex((prevIndex) => (prevIndex + 1) % countries.length);
    } else if (currentX < -100) {
      // Dragged enough to flip to the previous flag
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
      {/* Header */}
      <header className="header">
        <img src="/logo-removebg-preview.png" alt="Logo" />
      </header>

      {/* Main Content */}
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
              {/* Previous Button */}
              <button className="prev" onClick={prevFlag}>
                
              </button>

              {/* Flag Container with Drag to Rotate */}
              <div
                className="flag-container"
                ref={flagContainerRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp} // Reset when mouse leaves the flag
                
              >
                <img
                  src={countries[currentIndex].flags.png}
                  alt={countries[currentIndex].name.common}
                  className="flag"
                />
                <h2>{countries[currentIndex].name.common}</h2>
                <p>Region: {countries[currentIndex].region}</p>
              </div>

              {/* Next Button */}
              <button className="next" onClick={nextFlag}>
                
              </button>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer>
        <h4>A dynamic platform to explore and discover flags of countries worldwide, symbolizing global wanderlust and cultural exploration.</h4>
      </footer>
    </div>
  );
}

export default App;