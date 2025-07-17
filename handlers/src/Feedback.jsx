import { useState } from 'react';
import './Feedback.css';

function Feedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="app">
      <h1>🍕 Rate Your Delivery</h1>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="feedback-box">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
                style={{
                  cursor: 'pointer',
                  color: (hover || rating) >= star ? 'gold' : 'gray',
                  fontSize: '30px'
                }}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="Write your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>

          <button type="submit">Submit Feedback</button>
        </form>
      ) : (
        <div className="thankyou-box">
          <h2>🙏 Thank You!</h2>
          <p>You rated us {rating} star(s)</p>
          <p>Your feedback: "{feedback}"</p>
        </div>
      )}
    </div>
  );
}

export default Feedback;