import express from 'express';
const app = express();

const Port = process.env.PORT || 4000;

app.get('/',(req,res) => {
    console.log('API call.');
})

app.listen(Port,() => {
    console.log(`server started at port ${Port}`);
})