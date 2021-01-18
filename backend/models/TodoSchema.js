const mongoose = require('mongoose');
const { Schema } = mongoose;

const todoSchema = new Schema(
    [
        {
            id: String,
            bucketName: String,
            todoItems: [
                {
                    itemName: String,
                    itemDescription: String
                }
            ]

        }
    ]

)

mongoose.model('todos', todoSchema);