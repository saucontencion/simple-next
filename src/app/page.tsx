'use client'
import { usePeer } from "./contex";
import styles from "./page.module.css";


export default function Home() {
  const {peer} = usePeer()

  return (
    
    <div className={styles.page}>
      <div >
        <form>
          <textarea id="incoming"></textarea>
          <button type="submit">submit</button>
        </form>
      </div>
      <pre id="outgoing"></pre>
    </div>
  );
}
// como le paso el peer?
// se rendiza y deja de aparecer la vista


