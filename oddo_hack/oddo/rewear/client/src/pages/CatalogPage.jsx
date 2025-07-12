// File: rewear/client/src/pages/CatalogPage.jsx

import React from "react";
import CategoryBrowser from "../components/products/CategoryBrowser";

const CatalogPage = () => {
  return (
    <>
      {/* Add a hero section if desired */}
      <section className="catalog-hero-section text-center text-white">
        <div className="container">
          <h1 className="display-5">Product Catalog</h1>
          <p className="lead">
            Browse our extensive collection of clothing and accessories
          </p>
        </div>
      </section>

      <CategoryBrowser />
    </>
  );
};

export default CatalogPage;
