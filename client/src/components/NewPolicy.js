import withRoot from "../withRoot";
import styles from "../css/Tap.module.css";
import { useEffect, useState } from "react";
import NewPolicyItem from "./NewPolicyItem";

function NewPolicy({ policies, token }) {
    const [newPolicies, setNewPolicies] = useState([]);

    useEffect(() => {
        const filtered = policies.filter((policy) => policy.status === "7");
        setNewPolicies(filtered);
    }, [])

    return (
        <div style={{ padding: "10px" }}>
            <div>
                <h3>Recent Updated Policies</h3>
            </div>
            <li className={styles.taps}>
                {newPolicies.length !== 0 ?
                    (newPolicies.map((item) => {
                        <NewPolicyItem item={item} key={item._id} token={token} />
                    }))
                    : null}
            </li>
        </div>
    )
}

export default withRoot(NewPolicy);