'use client'
import { useContextHook } from "./contex";
import styles from "./page.module.css";


export default function Home() {
  const {emitSignal,socket} = useContextHook()
  return (
    
    <div className={styles.page}>
      <div >
        <form>
          <textarea id="incoming"></textarea>
          <button type="submit">submit</button>
        </form>
      </div>
      <button onClick={()=>emitSignal(true)}>other button</button> {/* no pescar que no le puse signatura */}
      <pre id="outgoing"></pre>
    </div>
  );
}
// como le paso el peer?
// se rendiza y deja de aparecer la vista


