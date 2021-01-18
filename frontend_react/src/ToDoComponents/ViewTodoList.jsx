import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router";

export default function ViewTodoList({todoItems, getItem}) {
    
    const [todoCards, setTodoCards] = useState([])
    const [clickedBucket, setClickedBucket] = useState('')
    const [bucketId, setBucketId] = useState('')
    const [deleteCheck, setDeleteCheck] = useState(false)
    const history = useHistory();
    const getTodoItems = (btn) => {
        setClickedBucket(btn.target.innerText)
        console.log(btn.target.innerText, 'bucketName')
        var bucketItem = todoItems.find(x => x.bucketName === btn.target.innerText.trim())
        console.log(bucketItem, 'bucketItem')
        if (typeof bucketItem !== 'undefined') {
            setTodoCards(bucketItem.todoItems)
            setBucketId(bucketItem._id)
        }

    }
    const routeToEditPage = (e, todoItem) => {
        console.log(todoItem._id, 'id')
        console.log(history, 'history')
        console.log(bucketId, 'bucketId')
        history.push({
            pathname: `edit/${todoItem._id}`, state: {
                response: {
                    bucketId : bucketId,
                    clickedBucket: clickedBucket,
                    todoItem: todoItem
                }
            }
        })
    }
    const deleteItem = (e, todoItem) =>{
        setDeleteCheck(false)
        let payload = {
            bucketName: clickedBucket,
            bucketId: bucketId,
            todoItems: [
                {   
                    itemId: todoItem._id,
                    itemName: todoItem.itemName,
                    itemDescription: todoItem.itemDescription
                }
            ]
        }
        fetch('http://localhost:4000/api/deleteTodo/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                console.log('Created Gist:', data.html_url);
                setDeleteCheck(true)
            });
    }
    useEffect(()=>{
        console.log(history,'historyhistory')
        if(todoItems.length > 0 && history?.location?.state?.response?.frompath === 'createTodo' || deleteCheck){
          getItem()
        }
    },[history, deleteCheck])

    useEffect(() => {
        if(todoItems.length > 0){
            if(deleteCheck) {
                let getBucketNm = clickedBucket.length > 0  ? clickedBucket : todoItems[0].bucketName.trim()
                var bucketItem = todoItems.find(x => x.bucketName === getBucketNm)
                setTodoCards([...bucketItem.todoItems]);
            }
            else{
                setTodoCards([...todoItems[0].todoItems]);
            }
            console.log(todoItems[0].todoItems,'todoItems[0].todoItems')
            setClickedBucket(clickedBucket.length > 0  ? clickedBucket : todoItems[0].bucketName.trim())
        }
     }, [todoItems])
    return (
        <React.Fragment>
            {
                <div className="card" >
                    <div className="card-body">
                        <h5 className="card-title">Existing To-do Buckets</h5>
                        <div className="row">
                            {
                                todoItems && todoItems.length > 0 && todoItems.map((x, ind) => {
                                    return (
                                        <div className="col-md-3" style={{ marginBottom: '15px' }}>
                                            <button type="button" className="btn btn-outline-info" onClick={getTodoItems}>{x.bucketName}</button>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            }
            <div className="row"></div>
            <div className="card" >
                <div className="card-body">
                    <h5 className="card-title">To-do items for {clickedBucket}</h5>
                    <div className="row">
                        {todoCards && todoCards.length > 0 && todoCards.map((x, ind) => {
                            return (
                                <React.Fragment>
                                    <div className="col-md-3" style={{ marginBottom: '15px' }}>
                                        <div className="card todo-card">
                                            <h5 className="card-header">{x.itemName}</h5>
                                            <div className="card-body">
                                                <p className="card-text">{x.itemDescription}</p>
                                                <button type="button" class="btn btn-outline-dark" onClick={(e) => routeToEditPage(e, x)} style={{marginRight:'5px'}}><i className='fa fa-edit'></i></button>
                                                <button type="button" class="btn btn-outline-danger" onClick={(e) => deleteItem(e, x)}><i className='fa fa-trash'></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}