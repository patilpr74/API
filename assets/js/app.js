let cl = console.log;

const postForm = document.getElementById('postForm');
const titleControl = document.getElementById('title');
const contentControl = document.getElementById('content');
const userIdControl = document.getElementById('userId');
const addPost = document.getElementById('addPost');
const updatePost = document.getElementById('updatePost');
const postContainer = document.getElementById('postContainer');
const loader = document.getElementById('loader');



let BASE_URL = 'https://crud-e663b-default-rtdb.asia-southeast1.firebasedatabase.app'
let POST_URL = `${BASE_URL}/post.json`
cl(POST_URL)


const snackBar = (msg, icon) =>{
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })
}

const postTemplating = (arr) => {
    let result = '';
    arr.forEach(blog => {
        result += `<div class="col-md-4 my-4">
                <div class="card" id="${blog.id}">
                    <div class="card-header">
                        <h4>${blog.title}</h4>
                    </div>
                    <div class="card-body">
                        <p>${blog.content}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onClick="onEdit(this)" class="btn btn-success btn-sm"> Edit </button>
                        <button onClick="onRemove(this)" class="btn btn-danger btn-sm"> Remove </button>
                </div>
            </div>
        </div>`
    })
    postContainer.innerHTML = result;

}
const onEdit = (ele) => {
    let Edit_Id = ele.closest('.card').id;
    cl(Edit_Id)
    localStorage.setItem('Edit_Id', Edit_Id);
    let Edit_URL = `${BASE_URL}/post/${Edit_Id}.json`

    makeApiCall('GET' , Edit_URL, null)
}

const onRemove = (ele) => {
    
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
    }).then((result) => {
        if (result.isConfirmed) {
            let Remove_Id = ele.closest('.card').id;
            localStorage.setItem('Remove_Id', Remove_Id);
            cl(Remove_Id)
            let Remove_URL = `${BASE_URL}/post/${Remove_Id}.json`

            makeApiCall('DELETE', Remove_URL, null)

        }

    });

}


const makeApiCall = (methodName, url, msgBody) => {
    loader.classList.remove('d-none')
    let xhr = new XMLHttpRequest()
    xhr.open(methodName, url)
    xhr.onload = () => {
        loader.classList.add('d-none')
        if (xhr.status >= 200 && xhr.status <= 299) {
            let obj = JSON.parse(xhr.response)
            cl(obj)

            if (methodName === 'GET' && url === POST_URL) {
                let dataArr = []
                for (const key in obj) {
                    // cl(obj[key])
                    obj[key].id = key
                    // cl(obj[key])
                    dataArr.push(obj[key])
                }
                cl(dataArr)
                postTemplating(dataArr)
                snackBar(`Data is fetched successfully!!!`, 'success')
            } else if (methodName === 'GET') {
                snackBar(`${obj.title} successfully!!!`, 'success')

                titleControl.value = obj.title
                contentControl.value = obj.content
                userIdControl.value = obj.userId

                addPost.classList.add('d-none')
                updatePost.classList.remove('d-none')

            } else if (methodName === 'POST') {
                postForm.reset()
                let newId = obj.name;
                msgBody.id = newId;
                let col = document.createElement('div')
                col.className = 'col-md-4 my-4'
                col.innerHTML = `<div class="card" id="${msgBody.id}">
                                    <div class="card-header">
                                        <h4>${msgBody.title}</h4>
                                    </div>
                                    <div class="card-body">
                                        <p>${msgBody.content}</p>
                                    </div>
                                    <div class="card-footer d-flex justify-content-between">
                                        <button onclick = "onEdit(this)" class="btn btn-success">Edit</button>
                                        <button onclick = "onRemove(this)" class="btn btn-danger">Remove</button>
                                    </div>
                                </div>`
                postContainer.prepend(col)
                snackBar(`New post is added successfully!!!`, 'success')
            } else if (methodName === 'PATCH') {
                snackBar(`${msgBody.title} is updated succussfully!!!`, 'success')
                postForm.reset()
                let card = document.getElementById(msgBody.id)
                // cl(card)
                let h4 = card.querySelector('h4')
                // cl(h4)
                let p = card.querySelector('p')
                h4.innerHTML = msgBody.title
                p.innerHTML = msgBody.content

                addPost.classList.remove('d-none')
                updatePost.classList.add('d-none')
            } else if (methodName === 'DELETE') {
                let Remove_Id = localStorage.getItem('Remove_Id')
                let card = document.getElementById(Remove_Id).parentElement
                card.remove()
                snackBar('This data is remove successfully!!!', 'success')
            }
        }
    }
    let msg = msgBody ? JSON.stringify(msgBody) : null
    xhr.send(msg)
}

makeApiCall('GET', POST_URL, null)



const onSubmitPost = (eve) => {
    eve.preventDefault();
    let postObj = {
        title: titleControl.value,
        content: contentControl.value,
        userId: userIdControl.value

    }
    cl(postObj)
    makeApiCall('POST', POST_URL, postObj)

}

postForm.addEventListener('submit', onSubmitPost);

const onUpdatePost = (eve) => {
    let Update_Id = localStorage.getItem('Edit_Id');
    cl(Update_Id)
    let Update_URL = `${BASE_URL}/post/${Update_Id}.json`
    let Update_Obj = {
        title: titleControl.value,
        content: contentControl.value,
        userId: userIdControl.value,
        id: Update_Id
    }
    cl(Update_Obj)
    makeApiCall('PATCH', Update_URL, Update_Obj)
}

updatePost.addEventListener('click', onUpdatePost);