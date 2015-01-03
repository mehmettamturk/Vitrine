Vitrine
=======

NodeJS, Mongo and AngularJS Based Ecommerce Application.

# Initialization
By default, the repository contains a test schema for test purposes. In order to setup the product collection for testing call the server executable with the `--initCollection` parameter.

```bin/www --initCollection```

*Important: * Running the server with `initCollection` is necessary only once, otherwise the product collections will be wiped over and over again.

# API Docs
## Get category tree:
Category tree can be retrieved via this API. This API is very important for the FE application. At initialization, FE application must get category tree in order to display the category list.

GET `/category/list`

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

GET `/category/:categoryName`

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

## Edit product
This api is used for modifying the product data. You can provide following fieds.

PUT `/product/:productName`

####Data:
```
{
    "name": "unique-name-for-the-product",
    "displayName": "White T-Shirt",
    "description": "Short description text",
    "body": "Long body description text",
    "price": 123,
    "quantity": 100,
    "images": ["/img/image.png"]
}
```

## Get product
This api is used for obtaining all the information of a product.

GET `/product/:productName`

####Example response:
```
{
    "name": "unique-name-for-the-product",
    "displayName": "White T-Shirt",
    "description": "Short description text",
    "body": "Long body description text",
    "price": 123,
    "quantity": 100,
    "images": ["/img/image.png"]
}
```

