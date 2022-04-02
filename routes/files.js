const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');



let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    }
})

let upload = multer({
    storage,
    limits: { fileSize: 1000000 * 20 },
}).single('myfile'); //20mb



async function clean() {
    const files = await File.find({ createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
    if (files.length) {
        for (const file of files) {
            try {
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`successfully deleted ${file.filename}`);
            } catch (err) {
                console.log(`error while deleting file ${err} `);
            }
        }
    }
    console.log('Job done!');
}



router.post('/', (req, res) => {

    clean().then(process.exit);

    // Validate request + Store file
    upload(req, res, async (err) => {
        if (!req.file) {
            return res.json({ error: 'All fields are required. Please upload a file' })
        }
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        });
        const response = await file.save();
        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
    });

    // Store into Database
    // Response -> Link
});



router.post('/send', async (req, res) => {

    const { uuid, emailTo, emailFrom } = req.body;

    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: 'All fields are required except expiry.' });
    }

    // Get data from db 
    try {
        const file = await File.findOne({ uuid: uuid });
        if (file.sender) {
            return res.status(422).send({ error: 'Email already sent once.' });
        }
        file.sender = emailFrom;
        file.receiver = emailTo;
        const response = await file.save();

        // send mail
        const sendMail = require('../services/mailService');

        sendMail({
            from: process.env.MAIL_ID,
            to: emailTo,
            subject: 'Easy Share file sharing',
            text: `${emailFrom} shared a file with you.`,
            html: require('../services/emailTemplate')({
                emailFrom,
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
                size: parseInt(file.size / 1000) + ' KB',
                expires: '24 hours'
            })
        }).then(() => {
            return res.json({ success: true });
        }).catch(err => {
            return res.status(500).json({ error: 'Error in email sending.' });
        });
    } catch (err) {
        return res.status(500).send({ error: 'Something went wrong.' });
    }

});

module.exports = router;