import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import {useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [address,setAddress]=useState({addressLine1:"",addressLine2:""});
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price*item.count;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };
  //detele item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      if(myCart[index].count===1)
      {
        myCart.splice(index, 1);
      }else{
        myCart[index].count--;
      }
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };
  const addCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart[index].count++;
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className=" cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You Have ${cart.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container ">
          <div className="row ">
            <div className="col-md-7  p-0 m-0">
              {cart?.map((p) => (
                <div className="row card flex-row" key={p._id}>
                  <div className="col-md-4">
                    <img
                      src={p.photo.data.$binary.base64}
                      className="card-img-top"
                      alt={p.name}
                      width="100%"
                      height={"150px"}
                    />
                  </div>
                  <div className="col-md-4">
                    <p>{p.name}</p>
                    <p>{p.description.substring(0, 30)}</p>
                    <p>Price : {p.price}<br/>
                    Amount : {p.count}</p>
                  </div>
                  
                  <div className="col-md-4 cart-remove-btn">
                  <button
                      className="btn btn-primary .mr-10"
                      onClick={() => addCartItem(p._id)}
                    >
                      Add
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-5 cart-summary ">
              <h2>Cart Summary</h2>
              <p>Total | Checkout</p>
              <hr />
              <h4>Total : {totalPrice()} </h4>
              {auth?.user ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <input placeholder="Address Line 1*" style={{marginBottom:"10px",borderRadius:"15px",padding:"5px"}}
                     onChange={(e)=>{setAddress({...address,addressLine1:e.target.value})}}></input><br/>
                    <input placeholder="Address Line 2*" style={{marginBottom:"10px",borderRadius:"15px",padding:"5px"}}
                    onChange={(e)=>{setAddress({...address,addressLine2:e.target.value})}}></input><br/>
                    
                  </div>
                </>
              ) :  (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Plase Login to checkout
                    </button>
                  )}
               
              
              <div className="mt-2">
                {(cart?.length>0 && auth?.user) ? (
                  <>
                    <button className="btn btn-success" onClick={()=>{
                      if(address.addressLine1==="" && address.addressLine2==="")
                      {
                        toast.error("Enter Shipping Address");
                        return;
                      }
                      toast.success("Order successfully placed");
                      setTimeout(()=>{
                        setCart([]);
                        localStorage.removeItem("cart")
                        navigate("/")
                        },3000)
                    }}>Order</button>
                  </>
                ):("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
