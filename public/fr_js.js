

    async function signup(){
    try{
    const username=document.getElementById("signup-username").value
    const password=document.getElementById("signup-password").value
    const response=await axios.post("http://localhost:3000/signup",{
    username:username,
    password:password
    })
    alert("You are signed up")
    }catch(error){
    alert("signup failed: "+error.response.data.message)
    }
    }
    async function signin(){
    try{
    const username=document.getElementById("signin-username").value
    const password=document.getElementById("signin-password").value
    const response=await axios.post("http://localhost:3000/signin",{
    username:username,
    password:password
    })
    localStorage.setItem("token",response.data.token)
    alert("you are signed in")
    }catch(error){
    alert("signin failed: "+error.response.data.message)
    }
    }
    async function getuserinfo(){

    const response=await axios.get("http://localhost:3000/me",{
    headers:{
    token:localStorage.getItem("token")
    }

    })

    document.getElementById("userinformation").innerHTML=
    "username: "+response.data.username+"Password: "+response.data.password


    }
    getuserinfo()
    async function addtodo(){
    try{
    const input=document.getElementById("add-todos").value
    const response=await axios.post("http://localhost:3000/add-todo",{
    input:input,

    },
    {
    headers:{
    token:localStorage.getItem("token")
    }
    })


    }catch(error){
    alert("creation failed: "+error.response.data.message)
    }
    }

    async function readtodo(){
    try{
        const response=await axios.get("http://localhost:3000/read-todo",{
            headers:{
            token:localStorage.getItem("token")
            }
        
            })
        const todos=response.data.todos
        render(todos)
       
    }catch(error){
    alert("Failed to fetch todos: " + error.response.data.message)
    }
    }


    function render(todos){
        const itemList=document.getElementById("todo-lists")
        itemList.innerHTML=""
    
        for(let i=0;i<todos.length;i++){
            const element=createComponenet(todos[i],i)
            itemList.appendChild(element)
        }
    }


    function createComponenet(todo,id){
        const newItem=document.createElement("li")
        newItem.setAttribute("id",`${id}`)
        if(todo.isEditing){
            newItem.innerHTML=`<input type="text" id="edit-input-${id}" value="${todo.title}">`
        }else{
            newItem.innerHTML=`<span style="text-decoration:${todo.isComplete ? 'line-through':'none'}"> ${todo.title}</span>`
        }
        
        
        if(!todo.isEditing){
        const comlButton=document.createElement("button")
        comlButton.innerHTML=todo.isComplete ? "undo":"complete"
        comlButton.setAttribute("onclick",`toggleCompleteItem(${id})`)
        newItem.appendChild(comlButton)
        }
        
        const editButton=document.createElement("button")
        editButton.innerHTML=todo.isEditing ? "Save":"Edit"
        editButton.setAttribute("onclick",`editItem(${id})`)
        newItem.appendChild(editButton)
        
        const delButton=document.createElement("button")
        delButton.innerHTML="Delete"
        delButton.setAttribute("onclick",`deleteItem(${id})`)
        newItem.appendChild(delButton)
        
        return newItem
        
        }




    function logout(){
    localStorage.removeItem("token")
    alert("You are logged out")
    document.getElementById("userinformation").innerHTML=""
    }


