const express = require('express');
const { registerController, loginController, getAllUsers, getUserById, deleteUser, demSoLuongUsers, updateProfileController, testController } = require('../controllers/userController');
const { requireSignIn, isAdmin } = require('../middleware/userMiddleware');
const routerUser = express.Router();

routerUser.post('/register', registerController)
routerUser.post('/login', loginController)
routerUser.get('/test', requireSignIn, isAdmin, testController)

routerUser.get('/users', getAllUsers)
routerUser.get('/users/:id', getUserById)
routerUser.delete('/delete/users/:id', deleteUser);
routerUser.get('/demSoLuonguser', demSoLuongUsers)
routerUser.put('/update/:id', updateProfileController)

routerUser.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({
        ok: true
    })
});

routerUser.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).json({ ok: true });
});

routerUser.put('/profile', requireSignIn, updateProfileController)
module.exports = routerUser;    