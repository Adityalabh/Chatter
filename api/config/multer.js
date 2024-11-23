import multer from "multer";
// import express from"express";


// if only one file is needed to send
// const upload = multer({
//     storage:multer.memoryStorage(),
//     limits: { fileSize: 20 * 1024 * 1024 } 
// }).send('file);

const upload = multer({
    storage:multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 } 
}).fields([
    {name:'bannerImage',maxCount:1},
    {name:'profileImage',maxCount:1},
    {name:"postImage",maxCount:1},
    
]);
export default upload;  