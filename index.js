const express=require("express")
const jwt=require("jsonwebtoken")

JWT_SECRET="iamthelegend"


 const app=express()
app.use(express.json())
const users=[]

function logger(req,res,next){
    console.log(req.method+" request came")
    next()
}
// Serve static files from the 'public' directory
app.use(express.static(__dirname + "/public"));

 app.get("/",function(req,res){
     res.sendFile(__dirname +"/public/index_html.html")
})

 app.post("/signup",logger,function(req,res){
    const username=req.body.username
    const password=req.body.password

    for(let i=0;i<users.length;i++){
        if(users[i].username===username){
            return res.json({
                message:"username alredy exists"
            })
        }
    }
    users.push({
        username:username,
        password:password
    })
    res.json({
        message:"You are signed up"
    })
 })


 app.post("/signin",logger,function(req,res){
    const username=req.body.username
    const password=req.body.password

    let founduser=null
    for(let i=0;i<users.length;i++){
        if(users[i].username===username && users[i].password===password ){
           founduser=users[i]
        }
    }
    if(!founduser){
        res.json({
            message:"Inavlid Credentials"
        })
        return
    }else{
        const token=jwt.sign({username},JWT_SECRET)
        res.json({
            token:token
        })
    }
    
 })

function auth(req,res,next){
    const token=req.headers.token
    
    if (!token) {
        return res.status(401).json({
            message: "Token is missing"
        });
    }
    const decodeddata=jwt.verify(token,JWT_SECRET)
    if(decodeddata.username){
        req.username=decodeddata.username
        next()
    }else{
        res.json({
            message:"you are not logged in"
        })
    }
}

 app.get("/me",logger,auth,function(req,res){
    const currentuser=req.username
    let founduser=null
    for(let i=0;i<users.length;i++){
        if(users[i].username===currentuser){
            founduser=users[i]
            break
        }
    }
    if (!founduser) {
        return res.status(404).json({
            message: "User not found"
        });
    }
    res.json({
        username:founduser.username,
        password:founduser.password
    })
 })
let todos=[]
app.post("/add-todo",logger,auth,function(req,res){
    const input=req.body.input
    if(input){
        todos.push({
            title:input.trim(),
            isEditing:false,
            isComplete:false,
        })
    }else{
        res.json({
            message:"fill the input box"
        })
    }
    console.log(todos)
    
})
app.get("/read-todo",logger,auth,function(req,res){
    if(todos!==null){
        res.json({
            todos:todos
        })
    }else{
        res.json({
            message:"Todos is empty"
        })
    }
   

})

app.put("/edit-todo", logger, auth, function(req, res) {
    const { id, newTitle } = req.body;  // Get the ID and newTitle from the request body

    if (todos[id] !== undefined) {  // Check if the todo exists
        todos[id].title = newTitle.trim();  // Update the title
        // todos[id].isEditing = false;  
        res.json({ todos: todos });
    } else {
        res.status(400).json({ message: "Todo not found" });
    }
});
app.get("/read-todos", logger, auth, function(req, res) {
    res.json({ todos: todos });
});

app.put("/complete-todo",logger,auth,function(req,res){
    const { id } = req.body;
    if (todos[id] !== undefined) {
        todos[id].isComplete = !todos[id].isComplete; // Toggle the completion status
        res.json({ todos: todos });
    } else {
        res.json({ message: "Todos is empty" });
    }

})
app.delete("/delete-todo",logger,auth,function(req,res){
    const { id } = req.body;
    if (todos !== null) {
        todos = todos.filter((_, index) => index !== parseInt(id));
        res.json({ todos: todos });
    } else {
        res.json({ message: "Todos is empty" });
    }
})

 app.listen(3000)