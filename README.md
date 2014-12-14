Vitrine
=======

NodeJS, Mongo and AngularJS Based Ecommerce Application.


# API Docs
## Get category tree:
Category tree can be retrieved via this API. This API is very important for the FE application. At initialization, FE application must get category tree in order to display the category list.

GET `/product/categories`

####Example response:
```
{
  "displayName" : "Root",
  "children" : [
    {
      "displayName" : "Electronics",
      "children" : [
        {
          "displayName" : "Smart Phones",
          "children" : [],
          "name" : "smart-phones"
        }
      ],
      "name" : "electronics"
    },
    {
      "displayName" : "Sporting Goods",
      "children" : [
        {
          "displayName" : "Shoes",
          "children" : [],
          "name" : "shoes"
        }
      ],
      "name" : "sporting-goods"
    },
    {
      "displayName" : "Home & Gardening",
      "children" : [],
      "name" : "home-gardening"
    }
  ],
  "name" : "root"
}
```


## Get products by category name
You can get all product within a given category-name using this API. The reponse contains all products with the given category name.

GET `/product/category/:categoryName`

####Example response:
```
[
  {
    "displayName" : "Soccer Shoes",
    "type" : "product",
    "images" : [
      "/img/adidas.png"
    ],
    "features" : [],
    "price" : 7,
    "remainingQuantity" : 150,
    "description" : "Adidas x",
    "body" : "this is the body",
    "name" : "asd2e",
    "creator" : "mertdogar"
  }
]
```

## Add product
In order to add a product to the catelogue, you must make a post request to the path specified below. The product data is delivered via post data in JSON format.

POST `/product`

####Data:
```
{
    "categoryName": "categoryName",
    "name": "unique-name-for-the-product",
    "displayName": "White T-Shirt",
    "description": "Short description text",
    "body": "Long body description text",
    "price": 123,
    "quantity": 100,
    "images": ["/img/image.png"]
}
```

