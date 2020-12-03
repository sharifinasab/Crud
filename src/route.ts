import express from 'express';
import { crud as itemCrud } from './controller/todoItemController';
import { crud as listCrud }  from './controller/todoListController';

const router = express.Router();

router.get('/list', listCrud.getList);
router.get('/list/:listId', listCrud.getListById);
router.post('/list', listCrud.createList);
router.put('/list', listCrud.updateList);
router.delete('/list/:listId', listCrud.deleteList);

router.get('/list/:listId/item', itemCrud.getItem);
router.get('/list/:listId/item/:itemId', itemCrud.getItemById);
router.post('/list/:listId/item', itemCrud.createItem);
router.put('/list/:listId/item/updateDescription', itemCrud.updateItemDescription);
router.put('/list/:listId/item/updateStatus', itemCrud.updateItemStatus);
router.delete('/list/:listId/item/:itemId', itemCrud.deleteItem);

export default router;