USE filigrana;

CREATE TABLE SALE_PRODUCTS (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  SALE_ID INT,
  PRODUCT_CODE VARCHAR(255),
  PRODUCT_VALUE DECIMAL(10, 2),
  PRODUCT_QUANTITY INT NOT NULL DEFAULT 1 CHECK (PRODUCT_QUANTITY > 0),
  FOREIGN KEY (SALE_ID) REFERENCES SALES(ID)
);

ALTER TABLE SALES MODIFY CLIENT_ID INT(11) NULL;