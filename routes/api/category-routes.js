const router = require('express').Router();
const { Category, Product } = require('../../models');

// `/api/categories` endpoint

// gets all categories along with the included Product table data
router.get('/', async (req, res) => {
  try{
    const categoryData = await Category.findAll({
      include: [{model: Product}]
    });
    res.status(200).json(categoryData);
  } catch(err) {
    res.status(500).json(err)
  }
});


// gets a single category through its ID along with the included Product data
router.get('/:id', async (req, res) => {
  try{
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{model: Product}]
    });

    // if there is no category data, the message will return no category with this ID
    if(!categoryData){
      res.status(404).json({message: 'No category with this id!'});
      return;
    }
    res.status(200).json(categoryData);
  } catch(err){
    res.status(500).json(err);
  }
});

// creates a new category 
router.post('/', async (req, res) => {
  try{
    // creates category and passes through the request body
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch(err){
    res.status(400).json(err);
  }
});

// updates the single ID of a category
router.put('/:id', async (req, res) => {
  try{
    const categoryData = await Category.update(req.body, {
      // calls the ID of the requested ID to know what to update
      where: {
        category_id: req.params.id
      }
    });
    res.status(200).json(categoryData)
  }catch(err){
    res.status(500).json(err);
  }
});

// deletes a category 
router.delete('/:id', async (req, res) => {
  try{
    const categoryData = await Category.destroy({
      // selects the ID of the category the user wants to delete 
      where: {
        category_id: req.params.id
      }
    });
    // if there is no data, the message will return no category with this ID
    if(!categoryData){
      res.status(404).json({ message: 'No category with this id!'});
      return;
    }
    res.status(200).json(categoryData);
  } catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;
