import React, { useState } from "react";

const faqs = [
  {
    question: "How often can I get a tarot reading?",
    answer: "You can get one tarot reading per day.",
  },
  {
    question: "How are the tarot readings generated?",
    answer:
      "Our tarot readings are randomly generated using a custom algorithm. They are not based on personal information or previous readings.",
  },
  {
    question: "Can I request a specific tarot card for my reading?",
    answer:
      "No, our algorithm randomly generates the tarot cards for each reading.",
  },
  {
    question: "Can I save my tarot readings?",
    answer:
      "Yes, you can save your tarot readings by taking a screenshot or saving the image provided at the end of each reading.",
  },
];

export default function Support() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-white border-4 border-yellow-600">
      <h1 className="text-4xl font-bold text-yellow-600 mb-8">Support</h1>
      <p className="text-lg text-center max-w-3xl mb-12 px-4 leading-relaxed">
        We're here to help! If you have any questions, issues, or feedback
        about Daily Tarot Reader, please don't hesitate to reach out to us at{" "}
        <a
          className="bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent font-semibold"
          href="mailto:dailytarotreaderhelp@gmail.com"
        >
          dailytarotreaderhelp@gmail.com
        </a>
        . We'll do our best to get back to you within 24 hours.{" "}
        <span role="img" aria-label="smiling-face">
          😊
        </span>
      </p>

      <div className="w-full max-w-3xl border-t-4 border-yellow-600 pt-8">
        <h2 className="text-3xl font-bold text-yellow-600 text-center mb-6">
          FAQ
        </h2>
        <ul className="space-y-6">
          {faqs.map((faq, index) => (
            <li key={index}>
              <button
                onClick={() => toggleFAQ(index)}
                className="text-left w-full focus:outline-none"
              >
                <h4 className="text-xl font-bold bg-gradient-to-r from-purple-700 to-blue-500 bg-clip-text text-transparent transition-all">
                  Q: {faq.question}
                </h4>
              </button>
              {openIndex === index && (
                <p className="text-base mt-2 text-white transition-all">
                  A: {faq.answer}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
