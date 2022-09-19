import withRoot from "../withRoot";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ReRendering() {

    const navigate = useNavigate();

    useEffect(() => {
        navigate(-1)
    }, [])

    return (
        <>
        </>
    );
}

export default withRoot(ReRendering);