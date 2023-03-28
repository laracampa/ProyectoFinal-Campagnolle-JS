//Ejemplo de uso de una API y Fetch. En un sitio real podría ser reemplazado por publicaciones del sitio.

document.addEventListener('DOMContentLoaded', function(){
    let posts = document.querySelector('.publicaciones')
    async function fetchPosts(url){
        let data = await fetch (url);
        let response = await data.json();

        for (let i = 0; i < response.length; i++){
            posts.innerHTML += `
            <div class="posts">
                <h2 class="post-title">${response[i].title}</h2>
                <p class="post-body">${response[i].body}</p>
            </div>
            `;
        }  
    };
    fetchPosts('https://jsonplaceholder.typicode.com/posts')
})