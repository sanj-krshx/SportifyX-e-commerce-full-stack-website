function TestimonialCard({
  name,
  review
}) {
  return (
    <div className="testimonial-card">

      <h3>{name}</h3>

      <p>
        "{review}"
      </p>

    </div>
  );
}

export default TestimonialCard;