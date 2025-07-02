import React from "react";

export default function About() {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-8 text-white border-4 border-yellow-600">
        <h1 className="text-4xl font-bold text-white mb-6">About</h1>
        <p className="text-lg text-center max-w-3xl leading-relaxed">
          <span role="img" aria-label="sparkles">✨</span>{" "}
          Welcome to{" "}
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-blue-500 bg-clip-text text-transparent">
            Daily Tarot Reader!
          </span>{" "}
          Our mission is to help you find{" "}
          <span className="underline text-yellow-600">guidance</span>,{" "}
          <span className="underline text-yellow-600">clarity</span>, and{" "}
          <span className="underline text-yellow-600">insight</span> through the ancient art of tarot reading.{" "}
          <span role="img" aria-label="crystal-ball">🔮</span>
          <br /><br />
          Our app provides a <span className="underline text-yellow-600">simple</span>,{" "}
          <span className="underline text-yellow-600">easy-to-use</span> platform for accessing tarot readings from the comfort of your own home.
          Once a day, our app generates a three-card tarot reading for you, giving you insight into your{" "}
          <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-yellow-300 bg-clip-text text-transparent">past</span>,{" "}
          <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">present</span>, and{" "}
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">future</span>.{" "}
          <span role="img" aria-label="three-cards">🃏🃏🃏</span>
          <br /><br />
          We <span className="underline text-yellow-600">believe</span> in the{" "}
          <span className="underline text-yellow-600">power</span> of tarot to provide direction and support in navigating life's challenges.
          Our team of experienced tarot readers has carefully curated a selection of decks that reflect a variety of perspectives and traditions,
          ensuring that you have access to the right deck to meet your needs.{" "}
          <span role="img" aria-label="thumbs-up">👍</span>
          <br /><br />
          At{" "}
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-blue-500 bg-clip-text text-transparent">
            Daily Tarot Reader
          </span>
          , we're committed to providing a safe and supportive space for everyone to explore the mysteries of tarot. Whether you're a seasoned tarot
          enthusiast or just getting started, we{" "}
          <span className="underline text-yellow-600">welcome</span> you to join our community and experience the{" "}
          <span className="underline text-yellow-600">magic</span> of tarot for yourself.{" "}
          <span role="img" aria-label="heart">❤️</span>
          <br /><br />
          Thank you for choosing{" "}
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-blue-500 bg-clip-text text-transparent">
            Daily Tarot Reader
          </span>
          ! We look forward to being a part of your journey.{" "}
          <span role="img" aria-label="star">⭐️</span>
        </p>
      </div>
    );
  }
  