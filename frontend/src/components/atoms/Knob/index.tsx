import styles from "./Knob.module.css";

interface KnobProps {
  ariaLabel: string;
  selected: boolean;
  onClick: () => void;
  variant?: 'promotional';
}

const Knob = ({ ariaLabel, selected, onClick, variant }: KnobProps) => {
  return (
    <button
      id=":rgi:"
      className={`${styles.track} 
        ${selected && styles.track_on} 
        ${variant === 'promotional' && styles.promotional}`}
      aria-label={ariaLabel}
      role="switch"
      type="button"
      aria-checked={selected}
      onClick={onClick}
    >
      <div
        className={`${styles.knob} 
        ${selected && styles.knob_on}
        ${variant === "promotional" && styles.promotional}`}
      ></div>
    </button>
  );
};

export default Knob;
