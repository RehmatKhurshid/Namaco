import User from "../../models/user/users.js";

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
