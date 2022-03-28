const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// `/api/products` endpoint

// gets all product data including the category data, and tag data through the producttag table
router.get('/', async (req, res) => {
  try{
    const productData = await Product.findAll({
      include: [{model: Category}, {model: Tag, through: ProductTag}]
    });
    res.status(200).json(productData);
  } catch(err){
    res.status(500).json(err);
  }
});

// gets one product by getting the primary key and the included data and tag data through the producttag table
router.get('/:id', async (req, res) => {
  try{
    const productData = await Product.findByPk(req.params.id, {
      include: [Category, {model: Tag, through: ProductTag}]
    });
    if(!productData){
      res.status(404).json({message: 'No product with this id!'});
      return;
    }
    res.status(200).json(productData);
  } catch(err){
    res.status(500).json(err);
  }
});

// creates a new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// updatea single product by its ID
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      product_id: req.params.id,
    },
  })
    .then((product) => {
      // finds all associated tags 
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // gets a list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // creates a filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // selects which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // runs both actions
      return Promise.all([
        ProductTag.destroy({ where: { ProductTag_id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      res.status(400).json(err);
    });
});

// delete a single product by its ID
router.delete('/:id', async (req, res) => {
  try{
    const productData = await Product.destroy({
      where: {
        product_id: req.params.id
      }
    });
    if(!productData){
      res.status(404).json({message: 'Product with this id not found!'});
      return;
    }
    res.status(200).json(productData);
  } catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;
