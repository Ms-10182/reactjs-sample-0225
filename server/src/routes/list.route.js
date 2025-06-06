import {Router} from 'express';
import {getAllLists, createList, deleteList, updateList} from '../controllers/list.controller.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';

const router = Router();
router.use(verifyJWT);

router.get('/', getAllLists);
router.post('/', createList);
router.patch('/:listId', updateList);
router.delete('/:listId', deleteList);

export default router;
