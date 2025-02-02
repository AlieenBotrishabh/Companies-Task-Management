const Task = require('../model/model');
const jwt = require('jsonwebtoken');
const brcypt = require('bcrypt');

const registerUser = async(req, res) => {

    const { empid, name, email, password } = req.body;

    try
    {
    const checkExistingUser = await Task.findOne({
        $or : [{empid}, {email}]
    })

    if(checkExistingUser)
    {
        res.status(200).json({
            msg : 'User already exists'
        })
    }
    }
    catch(err)
    {
        res.status(400).json({
            msg : 'An error  ocurred'
        })
    }

    const salt = await brcypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newlyCreatedUser = new Task({
        empid,
        name,
        email,
        password : hashedPassword
    })

    await newlyCreatedUser.save();

    if(newlyCreatedUser)
    {
        res.status(200).json({
            msg : 'User authenticated successfully'
        })
    }

    else
    {
        res.status(400).json({
            msg : 'Unable to register please try again'
        })
    }
}

const loginUser = async() => {
    const { empid, password } = req.body;

    const user = await task.findOne(empid);

    if(!user)
    {
        res.status(400).json({
            msg : 'User not found Kindly register first'
        })
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if(!isPassword)
    {
        res.status(400).json({
            msg : 'Invalid Password'
        })
    }

    const accessToken = jwt.sign({
        empid : user.empid,
        name : user.name,
        email : user.email,
        password : user.password
    }, process.env.JWT_SECRET_KEY, {
        expiresIn : '1m'
    })
}

module.exports = {registerUser, loginUser};