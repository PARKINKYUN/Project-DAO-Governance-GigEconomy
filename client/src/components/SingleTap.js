import styles from "../css/Tap.module.css";

function SingleTap({ writer, date, children }) {
  return (
    <li className={styles.taps}>
      <div className="writer">{writer}</div>
      <div className="date">{date}</div>
      <div>{children}</div>
    </li>
  );
}

export default SingleTap;
