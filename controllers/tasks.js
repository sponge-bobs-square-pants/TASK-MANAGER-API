const Task = require('../models/task');
const asyncWrapper = require('../Middleware/async');
const {createCustomError} = require('../errors/custom-error');

const getAllTasks = asyncWrapper(async (req, res) => {
        // res.status(200).send('All Items');
        const tasks = await Task.find({});
        res.status(200).json({tasks})
});

const createTask = asyncWrapper(async (req, res) => {
        const task = await Task.create(req.body);
        // res.status(201).json(req.body);
        console.log(req.body);
        res.status(201).json({task});  
});

const getTask = asyncWrapper(async (req, res) => {
        // res.status(200).json({id:req.params.id});
        // const {id:taskID} = req.params OR
        const taskID = req.params.id
        const task = await Task.findOne({_id:taskID})
        // console.log(req.params);
        // console.log(req.params.id);
        if(!task){
            return next(createCustomError(`No task with the id: ${taskID}`, 404));
        }
        res.status(200).json({task});
    
});

const updateTask = asyncWrapper(async (req, res) => {
        // res.status(200).send('update Task');
        const {id:taskID} = req.params;
        const updateField = {}
        if(req.body.name !== ''){
                updateField.name = req.body.name
        }
        updateField.completed = req.body.completed

        console.log(updateField);
        const task = await Task.findOneAndUpdate(
                {_id:taskID}, 
                { $set: updateField }, 
                {runValidators:true, new:true}
                );
        if(!task){
            return next(createCustomError(`No task with the id: ${taskID}`, 404));
        }
        res.status(200).json({task});
});

const deleteTask = asyncWrapper(async (req, res) => {
        // res.status(200).send('delete Item');
        const taskID = req.params.id;
        const task = await Task.findOneAndDelete({_id:taskID});
        if(!task){
            return next(createCustomError(`Cant find the task with ${taskID} ID to delete.Maybe the task is already deleted`, 404));
        }
        res.status(200).json({task})
        //for checking in postman we use the above code
        // res.status(200).send();
});

module.exports = {getAllTasks, createTask, getTask, updateTask, deleteTask}