import User from "../models/User.js"

export  const findByEmail = async(email)=>{
    return  User.findOne({email})
}

export const findById = async (id) => {
 return User.findById(id)   
}

export const create = async(userData)=>{
    const user = new User({
        name: userData.name,
        email: userData.email,
        passwordHash: userData.passwordHash,
    })
    return user.save()
}