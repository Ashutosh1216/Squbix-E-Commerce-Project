import React, { useState, useEffect } from "react";
import categoryData from "./CategoryData";
import productData from "./ProductData";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import "../styles/Homepage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);


  //get all cat
  const getAllCategory = async () => {
    setCategories(categoryData);
  };

  useEffect(() => {
    getAllCategory();
  }, []);
  //get products
  const getAllProducts = async () => {
    setProducts(productData);
  };

  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  //get filterd product
  const filterProduct = async () => {
    var filteredProducts=productData;
    if(checked.length>0)
    {
      filteredProducts = filteredProducts.filter((prod)=>
    (checked.includes(prod.category)) 
    )
    }
    if(radio.length>0)
    {
      filteredProducts = filteredProducts.filter((prod)=>
    (prod.price>=radio[0] && prod.price<=radio[1]) 
    )
    }
    
    setProducts(filteredProducts);
  };
  return (
    <Layout title={"ALl Products - Best offers "}>
      {/* banner image */}
      <img
        src="/images/banner.png"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      />
      {/* banner image */}
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-3 filters">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c,ind) => (
              <Checkbox
                key={ind}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p,ind) => (
                <div key={ind}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className="col-md-9 ">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p,ind) => (
              <div className="card m-2" key={ind}>
                <img
                  src={p.photo.data.$binary.base64}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="card-title card-price">
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </h5>
                  </div>
                  <p className="card-text ">
                    {p.description.substring(0, 60)}...
                  </p>
                  <div className="card-name-price">
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="btn btn-dark ms-1"
                      onClick={() => {
                        if(cart.filter((c)=>c._id===p._id).length>0)
                        {
                          setCart(cart.map((c)=>{
                            if(c._id===p._id)
                              return{...p,count:c.count+1}
                            else
                              return c
                          }));
                          localStorage.setItem(
                          "cart",
                          JSON.stringify(cart.map((c)=>{
                            if(c._id===p._id)
                              return{...p,count:c.count+1}
                            else
                              return c
                          }))
                        );
                        }
                        else{
                          setCart([...cart,{...p,count:1}]);
                          localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, {...p,count:1}])
                        );
                        }
                        
                        
                        toast.success("Item Added to cart");
                      }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
