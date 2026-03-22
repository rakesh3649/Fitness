import "./Map.scss";

const Map = () => {
  return (
    <div className="map">
      <iframe
        className="map__frame"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3410.7482400044987!2d75.7022928754623!3d31.25539207433635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a5f5e9c489cf3%3A0x4049a5409d53c300!2sLovely%20Professional%20University!5e0!3m2!1sen!2sus!4v1766501895137!5m2!1sen!2sus"
        width="600"
        height="450"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="FitnessClub Location"></iframe>
    </div>
  );
};

export default Map;
