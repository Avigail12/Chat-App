const express = require('express')
const router = express.Router();

router.get('/',(req,res) => {
    res.send('get req')
})

router.post('/',(req,res) => {

    const { src_dir } = req.body
    const { des_dir } = req.body

    if(!src_dir){
        return res.status(400).json({ success: false, msg: 'please provide source directory' })
    }

    if(!des_dir){
        return res.status(400).json({ success: false, msg: 'please provide desteniton directory' })
    }

    if (!fs.existsSync(src_dir)) {
        return res.status(400).json({ success: false, msg: 'The source not exists' })
    }

    if (!fs.lstatSync(src_dir).isDirectory()){
        return res.status(400).json({ success: false, msg: 'The source is not a library' })
    }
    
    copyFolder(src_dir,des_dir);
    res.status(200).json({ success: true, src_dir: src_dir })
})

module.exports = router
