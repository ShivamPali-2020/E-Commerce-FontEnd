import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAutheticated } from "../../auth/helper";
import { cartEmpty, loadCart } from "../../core/helper/cartHelper";

const StripeCheckout = ({
    products,
    setReload = f => f,
    reload = undefined
  }) => {
    const [data, setData] = useState({
      loading: false,
      success: false,
      error: "",
      address: ""
    });
  
    const token = isAutheticated() && isAutheticated().token;
    const userId = isAutheticated() && isAutheticated().user._id;
  
    const getFinalAmount = () => {
      let amount = 0;
      products.map(p => {
        amount = amount + p.price;
      });
      return amount;
    };
  
    const showStripeButton = () => {
      return isAutheticated() ? (
        <button className="btn btn-success">Pay with stripe</button>
      ) : (
        <Link to="/signin">
          <button className="btn btn-warning">Signin</button>
        </Link>
      );
    };
  
    return (
      <div>
        <h3 className="text-white">Stripe Checkout {getFinalAmount()}</h3>
        {showStripeButton()}
      </div>
    );
  };
  
  export default StripeCheckout;
  