import { useState } from "react";
import React  from "react";
import HashLoader from "react-spinners/HashLoader";
function Loader() {
    var loading = true;
    // const override = css`
    //     display: "block",
    //     margin: "0 auto",
    //     borderColor: "red",`;
    return (
        <div className="sweet-loading center-loader">
            <HashLoader
                color='#000000'
                loading={loading}
                css=''
                size={80}
            />
        </div>
    )
}

export default Loader