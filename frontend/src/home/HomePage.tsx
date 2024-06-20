/**
 * @file HomePage.tsx
 * @summary Home page component
 * @description A component for the home page
 * It displays the features of the app and an image of a scooter
 * The component is a functional component
 * It uses the React library
 * It uses the styled-components library to style the component
 * It uses the Material UI library to display the image
 * The component is used in the App.tsx component
 * The component is rendered in the / route in the App.tsx component
 * The component is exported and used in the App.tsx component
 * The component is responsive
 */
const HomePage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: window.innerWidth > 600 ? "row" : "column",
      }}
    >
      <div
        style={{
          width: window.innerWidth > 600 ? "50vw" : "90vw",
          padding: "5vw",
        }}
      >
        <h1>Introducing ParkRight: Your Smart Parking Companion</h1>
        <p>
          Explore the convenience and ease of parking with ParkRight, your
          ultimate app for finding, reserving, and managing parking spaces.
          Whether you're commuting to work or exploring the city, ParkRight
          ensures you have a hassle-free parking experience.
        </p>
        <h2>Features:</h2>
        <ul>
          <li>
            Image classification: Tells you if you parked the scooter right in
            your area
          </li>
          <li>
            Human Assistance: You can ask for help from our customer service
          </li>
        </ul>
      </div>
      <div
        style={{
          width: window.innerWidth > 600 ? "50vw" : "90vw",
          padding: "5vw",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          style={{ width: window.innerWidth > 600 ? "33vw" : "60vw" }}
          src="/images/scooter.webp"
          alt="parking"
        />
      </div>
    </div>
  );
};

export default HomePage;
