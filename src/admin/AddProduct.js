import React, { useState } from "react";
import Base from "../core/Base";
import { Link, Redirect } from "react-router-dom";
import { getCategories, createProduct } from "./helper/adminapicall";
import { useEffect } from "react";
import { isAutheticated } from "../auth/helper";

const AddProduct = () => {
  const { user, token } = isAutheticated();
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: "",
    categories: [],
    category: "",
    loading: false,
    error: "",
    createdProduct: "",
    getRedirect: false,
    formData: "",
  });

  const {
    name,
    description,
    price,
    stock,
    categories,
    category,
    loading,
    error,
    createdProduct,
    getRedirect,
    formData,
  } = values;

  const preload = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, categories: data, formData: new FormData() });
        console.log(categories);
      }
    });
  };
  useEffect(() => {
    preload();
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });
    createProduct(user._id, token, formData)
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({
            ...values,
            name: "",
            description: "",
            price: "",
            photo: "",
            stock: "",
            loading: false,
            createdProduct: data.name,
          });

          setTimeout(()=>{
            setValues({...values, getRedirect:true})
          },2000)
        }
      })
      .catch();
  };
  const handleChange = name => event => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const performRedirect=()=>{
    if(getRedirect){
      return <Redirect to="/admin/dashboard/"/>
    }
  }

  const successMessage=()=>(
      <div className="alert alert-success mt-3" style={{display:createdProduct?"":"none"}}>
          <h4>{createdProduct} created successfully</h4>
      </div>
  )

  const errorMessage=()=>(
      <div className="alert alert-danger mt-3" style={{display:error?"":"none"}}>
          <h4>Failed to create a product- {error}</h4>
      </div>
  )

  const createProductForm = () => (
    <form>
      <span>Post photo</span>
      <div className="form-group m-1">
        <label className="btn btn-block btn-success">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image"
            placeholder="choose a file"
          />
        </label>
      </div>
      <div className="form-group m-1">
        <input
          onChange={handleChange("name")}
          name="photo"
          className="form-control"
          placeholder="Name"
          value={name}
        />
      </div>
      <div className="form-group m-1">
        <textarea
          onChange={handleChange("description")}
          name="photo"
          className="form-control"
          placeholder="Description"
          value={description}
        />
      </div>
      <div className="form-group m-1">
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          placeholder="Price"
          value={price}
        />
      </div>
      <div className="form-group m-1">
        <select
          onChange={handleChange("category")}
          className="form-control"
          placeholder="Category"
        >
          <option>Select</option>
          {categories &&
            categories.map((cate, index) => (
              <option key={index} value={cate._id}>
                {cate.name}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group m-1">
        <input
          onChange={handleChange("stock")}
          type="number"
          className="form-control"
          placeholder="Quantity"
          value={stock}
        />
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-outline-success m-3"
      >
        Create Product
      </button>
    </form>
  );
  return (
    <Base
      title="Add a product here!"
      description="Welcome to product creation section"
      className="container bg-info p-4"
    >
      <Link to="/admin/dashboard" className="btn btn-md btn-dark m-3">
        Admin Home
      </Link>
      <div className="row bg-dark text-white rounded">
          {successMessage()}
          {errorMessage()}
          {performRedirect()}
        <div className="col-md-8 offset-md-2">{createProductForm()}</div>
      </div>
    </Base>
  );
};

export default AddProduct;
