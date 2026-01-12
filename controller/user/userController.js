import User from "../../models/user/users.js";
import bcrypt from 'bcrypt'


export const getAllUser = async (req, res) => {
    try {
        const data = await User.find();
        console.log(data);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
};
export const getUserById = async (req, res) => {
    try {
        const getId = await User.findById(req.params.id);

        if (!getId) {
            return res.status(404).json({ error: "user not found" });
        }
        res.status(200).json({ getId });
    } catch (error) {
        console.log(error);
    }
};
/** 
export const registerUser = async (req, res) => {
    try {
        if (
            !req.body ||
            !req.body.firstName ||
            !req.body.lastName ||
            !req.body.email ||
            !req.body.mobile
        ) {
            return res.status(400).json({ error: "some field is missing" });
        }

        const { firstName, lastName, email, mobile } = req.body;
        console.log(firstName, lastName, email, mobile);
        const user = new User({
            firstName,
            lastName,
            email,
            mobile,
        });
        await user.save();

        res.status(201).json({ message: "inserted success" });
    } catch (error) {
        console.log(error);
    }
};
*/

export const signUp = async (req, res) => {
    try {
        if (
            !req.body ||
            !req.body.firstName ||
            !req.body.lastName ||
            !req.body.email ||
            !req.body.mobile ||
            !req.body.password
        ) {
            return res.status(400).json({ error: "some field is missing" });
        }

        const { firstName, lastName, email, mobile, password } = req.body;

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            firstName,
            lastName,
            email,
            mobile,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};




export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log("here")

        //find email
        const isUser = await User.findOne({ email: email });

        if (!isUser) {
            return res.status(409).json({ "message": "invalid creds" })
        }

        //campare password

        const isPasswordMacthing = await bcrypt.compare(password, isUser.password);

        if (!isPasswordMacthing) {
            return res.status(400).json({ "message": "invalid creds" })
        }

        //create token
        const token = jwt.sign({ _id: isUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        //send response

        res.status(201).json({
            id: isUser._id,
            email: isUser.email,
            firstName: isUser.firstName,
            lastName: isUser.lastName,
            mobile: isUser.mobile,
            token
        })


    } catch (error) {
        console.log('inside login')
        res.status(500).json({ "message": "something went wrong" })
    }
}





export const updateUser = async (req, res) => {
    try {
        const upUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                mobile: req.body.mobile,
            },
            { new: true }
        );

        if (!upUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(upUser);
    } catch (error) {
        res.status(500).json({ error: "server error" });
    }
};
export const deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted" });
};
