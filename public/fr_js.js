

    async function signup(){
    try{
    const username=document.getElementById("signup-username").value
    const password=document.getElementById("signup-password").value
    const response=await axios.post("http://localhost:3000/signup",{
    username:username,
    password:password
    })
    if (response.status === 200) {
        // Clear the form fields after successful sign-up
        document.getElementById("signup-username").value = "";
        document.getElementById("signup-password").value = "";
        alert("Sign-up successful!");
    }
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
    if (response.status === 200) {
        // Clear the form fields after successful sign-up
        document.getElementById("signin-username").value = "";
        document.getElementById("signin-password").value = "";
        alert("Sign-in successful!");
    }
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


    function createComponenet(todo, id) {
        const newItem = document.createElement("li");
        newItem.setAttribute("id", `todo-item-${id}`);
        newItem.innerHTML = `<span style="text-decoration:${todo.isComplete ? 'line-through':'none'}"> ${todo.title}</span>`;
      
        if (!todo.isEditing) {
          const comlButton = document.createElement("button");
          comlButton.innerHTML = todo.isComplete ? "Undo" : "Complete";
          comlButton.setAttribute("onclick", `toggleCompleteItem(${id})`);
          comlButton.classList.add(todo.isComplete ? "undo" : "complete");  // Add button classes
          newItem.appendChild(comlButton);
        }
      
        const editButton = document.createElement("button");
        editButton.innerHTML = todo.isEditing ? "Save" : "Edit";
        editButton.setAttribute("onclick", `editItem(${id})`);
        editButton.classList.add(todo.isEditing ? "save" : "edit");  // Add button classes
        newItem.appendChild(editButton);
      
        const delButton = document.createElement("button");
        delButton.innerHTML = "Delete";
        delButton.setAttribute("onclick", `deletetodo(${id})`);
        delButton.classList.add("delete");  // Add button class for delete
        newItem.appendChild(delButton);
      
        return newItem;
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
                // First, fetch the current todos array
                const getResponse = await axios.get("http://localhost:3000/read-todos", {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                });
        
                let todos = getResponse.data.todos;
        
                // Set isEditing to true to enable edit mode
                // todos[id].isEditing = true;
        
                // Use prompt to ask the user for the new title
                const newTitle = prompt("Enter the new title for the todo:", todos[id].title);
        
                // If user cancels the prompt or leaves it empty, handle it
                if (newTitle === null || newTitle.trim() === "") {
                    alert("Todo title cannot be empty.");
                    return;
                }
        
                // Send PUT request to update the todo
                const response = await axios.put(
                    "http://localhost:3000/edit-todo", 
                    { id: id, newTitle: newTitle.trim() },  // Send the new title
                    {
                        headers: {
                            token: localStorage.getItem("token"),
                        }
                    }
                );
        
                // Get the updated todos array from the response
                todos = response.data.todos;
        
                // Re-render the todos on the page
                render(todos);
            } catch (error) {
                console.error("Failed to edit the todo:", error);
            }
        }
        
        
function logout(){
    localStorage.removeItem("token")
    alert("You are logged out")
    window.location.reload();
    }


