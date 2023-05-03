

const validator = (req,res,next)=>{

    const ipAddress = req.params.ip
    
    let regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    const validIP = regex.test(ipAddress);

    if(validIP)
    {
        return next();
    }else{
    res.status(400).json({message:"Please provide valid IPv4 address"});
    }
}

module.exports = {
    validator
}