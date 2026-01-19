import jwt from 'jsonwebtoken';
import User from '../models/user/users.js';


export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        console.log('token.......', token)
        if (!token) {
            // console.log('wrong token')
            res.status(401).json({ message: "unauthorization" })
        }

        const decode = await jwt.verify(token, process.env.JWT_SECRET)

        console.log('decode', decode)
        const user = await User.findById({ _id: decode._id });
        const { firstName, lastName, email } = user;
        req.user = {
            _id:user._id.toString(),
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            roles: user.roles
        };
        console.log(req.user);
        next()
    }

    catch (error) {
        res.status(401).json({ message: "Not Authenticated" })
        console.log(error)
    }
}