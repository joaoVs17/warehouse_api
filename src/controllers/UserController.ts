import { User as UserModel } from "../models/User";

const UserController = {

    create: async (req: any, res: any) => {
        
        const { first_name, last_name, email, recovery_email, phone, password} = req.body;

        console.log(req.body.first_name);

        try {
            const user = {
                first_name,
                last_name,
                email,
                recovery_email,
                phone,
                password
            }
            
            const response = await UserModel.create(user);

            res.status(201).json({response, msg: "User Created Successfully"});

        } catch (err) {
            console.log(err);
        }
    },

    getAll: async (req: any, res: any) => {
        
        try {
            const response = await UserModel.find();
            res.json({response})
        } catch(err) {
            console.log(err);
        }

    },

    delete: async (req: any, res: any) => {
        
        try {
            
            const id = req.params.id;
            const user = await UserModel.findById(id);

            if(!user) {
                res.status(404).json({msg: "User not found"});
                return;
            }

            const response = await UserModel.findByIdAndDelete(id);

            res.status(200).json({response, msg: "User deleted sucessfully"})

        } catch(err) {
            console.log(err);
        }

    }

}

export { UserController };