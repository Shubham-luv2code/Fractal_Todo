const mongoose = require('mongoose');
const todos = mongoose.model('todos');

module.exports = (app) => {
  app.post(`/api/createTodo`, async (req, res) => {
    var article_id = req.body.bucketName;
    let allTodos = await todos.find();
    if (allTodos.find(x => x.bucketName === article_id)) {
      todos.findOneAndUpdate(
        { bucketName: req.body.bucketName },
        { $push: { "todoItems": req.body.todoItems } },
        { safe: true, upsert: true },
        function (err, model) {
          if (err) {
            console.log(err);
            return res.send(err);
          }
          return res.json(model);
        });
    }
    else {
      await todos.create(req.body);
      return res.status(201).send({
        error: false
      })
    }


  });
  app.get(`/api/getTodo/`, async (req, res) => {
    var id = req.params.id;
    let allTodos = await todos.find();
    return res.status(200).send(allTodos);
  });
  app.put('/api/updateTodo', (req, res) => {
    todos.update({ 'todoItems._id': req.body.todoItems[0].itemId }, {
      '$set': {
        'todoItems.$.itemName': req.body.todoItems[0].itemName,
        'todoItems.$.itemDescription': req.body.todoItems[0].itemDescription
      }
    }, function (err, model) {
      if (err) {
        return res.send(err);
      }
      return res.json(model);
    });

  });
  app.delete('/api/deleteTodo', (req, res) => {
    todos.update({ '_id': req.body.bucketId }, {
      '$pull': {
        'todoItems':{_id: req.body.todoItems[0].itemId}
      }
    }, function (err, model) {
      if (err) {
        return res.send(err);
      }
      return res.json(model);
    });
  });
}