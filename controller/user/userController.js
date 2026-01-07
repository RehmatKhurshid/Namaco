import User from "../../models/user/users.js";

export const getAllUser = async (req, res) => {
    try {
        const data = await User.find();
        console.log(data);
        res.status(200).json(data)

    } catch (error) {
        console.log(error)
    }
}

export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, mobile } = req.body;
        console.log(firstName, lastName, email, mobile);
        const user = new User({
            firstName,
            lastName,
            email,
            mobile
        })
        await user.save();

        res.status(201).json({ message: "inserted success" })
    } catch (error) {
        console.log(error)
    }
}
