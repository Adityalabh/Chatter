import multer from "multer";
// import express from"express";

const upload = multer({
    storage:multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 } 
}).fields([
    {name:'bannerImage',maxCount:1},
    {name:'profileImage',maxCount:1},
    {name:"postImage",maxCount:1},
    
]);
export default upload;  