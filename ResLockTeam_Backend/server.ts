import app from "./app"

// Separated starting the server from the app so the test dont give an error about not awaiting a console log

// Start the server
app.listen(process.env.PORT, () =>{
    console.log("Server is running on port " + process.env.PORT);
});