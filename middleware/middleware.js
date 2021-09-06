const {asyncMiddleware, middlewareToPromise} = require('middleware-async')

const sendResponse = async (req,res,next) => {

    //try {
      //  res.status(200).json({ status: "ok", payload: res.payload })
      console.log('start middleware');
        //await next();
         console.log('response');
            //console.log(res.returnObject);
            if (!res.returnObject || !res.returnObject.statusCode) {
              return res.status(500).json({ status: "fail", message: "no response" })
            }
            switch (res.returnObject.statusCode) {
              case 200:
                  return res.status(200).json({ status: "ok", payload: res.returnObject.payload })
                  break;
              case 400:
                  return res.status(400).json({ status: "fail", payload: res.message })
                  break;
              case 500:
                  return res.status(200).json({ status: "fail", payload: res.message })
                  break;
          
              default:
                  break;
          }
    // } catch (error) {
        
    // }finally{
    //   console.log('finally');
    // }

}

module.exports = sendResponse


