

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

    document.getElementById("userinformation").innerHTML="username: "+response.data.username+"Password: "+response.data.password


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
        newItem.setAttribute("id",`todo-item-${id}`)
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
        delButton.setAttribute("onclick",`deletetodo(${id})`)
        newItem.appendChild(delButton)
        
        return newItem
        
        }


        async function deletetodo(id){
            try{
                const response=await axios.delete("http://localhost:3000/delete-todo",{
                    headers:{
                    token:localStorage.getItem("token")
                    },
                    data: { id: id },
                
                    })
                    const todos = response.data.todos;
                    render(todos)
                    }catch(error){
                alert("Failed to delete todos: " + error.response.data.message)
            }

        }

        async function toggleCompleteItem(id){
            try {
                const response = await axios.put("http://localhost:3000/complete-todo", 
                     { id: id },
                { 
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                    
                });
                
                const todos = response.data.todos;
                render(todos); 
            } catch (error) {
                console.error("Failed to toggle todo completion:", error.response.data.message);
            }
        }

        async function editItem(id) {
            try {
                // Make sure the input field exists
                const newTitle = document.getElementById(`edit-input-${id}`).value;
                if (!newTitle) {
                    console.error(`Input field with id edit-input-${id} not found`);
                    return;
                }
                
                console.log(`New title: ${newTitle}`);  // Debugging
                const response = await axios.put("http://localhost:3000/edit-todo", 
                    { id: id, newTitle: newTitle },
                    { headers: { token: localStorage.getItem("token") } }
                );
                
                const todos = response.data.todos;
                render(todos);
            } catch (error) {
                if (error.response) {
                    console.error("Error response:", error.response.data);
                } else {
                    console.error("Failed to Edit the todo", error);
                }
            }
        }
        
        
       

 function logout(){
    localStorage.removeItem("token")
    alert("You are logged out")
    document.getElementById("userinformation").innerHTML=""
    }


