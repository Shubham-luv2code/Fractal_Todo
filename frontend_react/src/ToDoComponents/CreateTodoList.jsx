import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
export default function CreateTodoList({todoItems}) {
    const [bucketName, setBucketName] = useState('');
    const [itemName, setItemName] = useState('');
    const [itemDesc, setItemDesc] = useState('');
    const [bucketNameSelect, setBucketNameSelect] = useState([...todoItems.map(x => x.bucketName)]);
    const [btnName, setBtnName] = useState('Create')
    const [itemId, setItemId] = useState('');
    const [bucketId, setBucketId] = useState('');
    const history = useHistory();
    useEffect(()=>{
        if(history.location.pathname.includes('edit')){
            const {response} = history.location.state;
            setBucketName(response.clickedBucket)
            setItemName(response.todoItem.itemName)
            setItemDesc(response.todoItem.itemDescription)
            setItemId(response.todoItem._id)
            setBucketId(response.bucketId)
            setBtnName('Update')
        }
        const bucketList = bucketNameSelect.map(x => {
            return(
                <option value={x}>
                    {x}
                </option>
            )
        })
        setBucketNameSelect(bucketList)
    },[])
    const handleChange = (e) => {
        if (e.target.id === 'bucketName') {
            setBucketName(e.target.value);
        }
        else if (e.target.id === 'itemName') {
            setItemName(e.target.value);
        }
        else if (e.target.id === 'itemDesc') {
            setItemDesc(e.target.value);
        }else if (e.target.id === 'bucketNameSelect') {
            setBucketName(e.target.value);
        }
    };
    
    const createItem = () => {
        let payload = {
            bucketName: bucketName,
            bucketId: history.location.pathname.includes('edit') ? bucketId : null,
            todoItems: [
                {   
                    itemId: itemId,
                    itemName: itemName,
                    itemDescription: itemDesc
                }
            ]
        }
        if(history.location.pathname.includes('edit')){
            fetch('http://localhost:4000/api/updateTodo/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                history.push({pathname: '/', state:{
                    response: {
                        frompath: 'createTodo'
                    }
                }})
            });
        }
        else{
            fetch('http://localhost:4000/api/createTodo/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                history.push({pathname: '/', state:{
                    response: {
                        frompath: 'createTodo'
                    }
                }})
            });
        }
        
    };
    return (
        <React.Fragment>
            <div className="form-group">
                <div className="row">
                <div className="col-md-4">
                    <label for="exampleInputEmail1">Choose From Dropdown</label>
                    <select type="text" className="form-control" id="bucketNameSelect" aria-describedby="bucketNameSelectHelp"  onChange={handleChange} value={bucketName}>
                    {bucketNameSelect}
                    </select>
                </div>
                
                <div className="col-md-4 text-center">
                    <p>OR</p>
                </div>
                <div className="col-md-4">
                    <label for="exampleInputEmail1">Create Your Own Bucket</label>
                    <input type="text" className="form-control" id="bucketName" aria-describedby="bucketNameHelp" placeholder="Enter bucket name" value={bucketName} onChange={handleChange} />
                </div>
                </div>
            </div>
            <div className="form-group">
                <label for="exampleInputEmail1">To-do Item</label>
                <input type="text" className="form-control" id="itemName" aria-describedby="itemNameHelp" placeholder="Enter item name" value={itemName} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label for="exampleInputEmail1">Item Description</label>
                <input type="text" className="form-control" id="itemDesc" aria-describedby="itemDescHelp" placeholder="Enter item description" value={itemDesc} onChange={handleChange} />
            </div>
            <button type="button" className="btn btn-primary" onClick={createItem}>{btnName}</button>
        </React.Fragment>
    )
}