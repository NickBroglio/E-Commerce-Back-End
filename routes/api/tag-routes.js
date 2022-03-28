const router = require('express').Router();
const { Tag, Product, ProductTag, Category } = require('../../models');

// `/api/tags` endpoint

// gets all data from the Tag table, along with the included Product data
router.get('/', async (req, res) => {
  try{
    const tagData = await Tag.findAll({
      include: [{model: Product}]
    });
    res.status(200).json(tagData);
  } catch(err){
    res.status(500).json(err)
  }
});

// gets a Tag by searching for a single ID, along with the included Product data
router.get('/:id', async (req, res) => {
  try{
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{model: Product}]
    });
    // if there is no Tag data, the message will return no Tag with this ID
    if (!tagData){
      res.status(404).json({message: 'No tag with this id!'});
      return;
    }
    res.status(200).json(tagData);
  } catch(err){
    res.status(500).json(err);
  }
});

// creates a new Tag 
router.post('/', async (req, res) => {
  try{
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  }catch(err){
    res.status(400).json(err);
  }
});

// updates a single Tag by its single ID
router.put('/:id', async (req, res) => {
  try{
    const tagData = await Tag.update(req.body, {
      where: {
        tag_id: req.params.id
      }
    });
    res.status(200).json(tagData);
  } catch(err){
    res.status(500).json(err);
  }
});

// deletes a Tag by its single ID
router.delete('/:id', async (req, res) => {
  try{
    const tagData = await Tag.destroy({
      where: {
        tag_id: req.params.id
      }
    });

    if(!tagData){
      res.status(404).json({ message: 'No tag with this id!'});
      return;
    }

    res.status(200).json(tagData);
  } catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;
