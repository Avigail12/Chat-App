async function dendResponse(req,res,next){

    try {
        result = await next();
        next();
         switch (res.statusCode) {
            case 200:
                await res.status(200).json({ status: "ok", payload: res.payload })
                break;
            case 400:
                res.status(400).json({ status: "fail", payload: res.message })
                break;
            case 500:
                res.status(200).json({ status: "fail", payload: res.message })
                break;
        
            default:
                break;
        }
    } catch (error) {
        
    }

}

module.exports = dendResponse
