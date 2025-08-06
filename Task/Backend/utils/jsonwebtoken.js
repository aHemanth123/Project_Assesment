// import jwt from "jsonwebtoken";

// const generateTokenandSetCookie=(userID,res)=>{
//     const token=jwt.sign({userID},process.env.JWT_SECRET_KEY,{
//         expiresIn:'15d'
//     });
//     res.cookie("jwt",token,{
//         maxAge:15*24*60*60*1000,
//         httpOnly:true,
//         sameSite:"strict",
//     });
// };
// export default generateTokenandSetCookie;
import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userID, res) => {
    const token = jwt.sign({ userID }, process.env.JWT_SECRET_KEY, {
        expiresIn: '15d',
    });

    res.cookie("token", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only true in production
        sameSite: "Lax", // recommended over "strict" in most cases
    });
    
    return token; // optional, in case you want to return it
};

export default generateTokenAndSetCookie;
