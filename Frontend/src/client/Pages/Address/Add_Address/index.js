import React, {useEffect, useState} from "react";
import "../../../../assets/styles/css/style.css";
import "../../../../assets/styles/css/bootstrap.min.css";
import {NavLink, useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function Add_Address() {
    const location = useLocation();
    const [loading, setLoading] = useState(false); // Thêm state loading

    useEffect(() => {

    }, []);

    return (
        <>
            <div className="container py-5">
                <div className="row g-4 justify-center">
                    <div className="col-8">
                        <div className="p-4 bg-light border rounded">
                            <p className="font-semibold mb-4 text-center"
                               style={{color: "#8c5e58", fontSize: "30px"}}>Thêm Địa Chỉ</p>
                            <form>
                                <div className="form-group mb-4">
                                    <label style={{color: "#8c5e58", fontSize: "20px"}}
                                           className="font-semibold mb-2">Địa Chỉ:</label>
                                    <input
                                        type="text"
                                        className="form-control rounded"
                                        name="address"
                                    />
                                </div>
                                <button className="btn btn-primary w-100 mt-3 font-semibold" type="submit"
                                        style={{color: '#442e2b', fontSize: "20px"}}>
                                    Thêm
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
