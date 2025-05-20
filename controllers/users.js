const user = require("../models/user.js")

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup = async(req,res)=>{
    try {
        let {username,email,password}=req.body;
        const newUser = new user({email,username})
        const registerUser = await user.register(newUser,password)
        console.log(registerUser)
        req.login(registerUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success","Welcom to YatraStay!")
        res.redirect("/listings")
        })
        
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login = async (req,res) => {
    req.flash("success","Welcome back YatraStay! ")
    let redirctUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirctUrl )
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!")
        res.redirect("/listings")
    })
}