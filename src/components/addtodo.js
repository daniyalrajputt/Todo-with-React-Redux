import React, { Component } from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { addingTodoAction } from '../store/action/action';
import { renderingTodoAction } from '../store/action/action';
import { deleteAllAction } from '../store/action/action';
import '../App.css';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';



class AddTodo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editingState: false,
            editingTodo: "",
            editingTodoId: "",
            editingIndex: "",
            todo: ""
        }
        firebase.database().ref('/').child("todos").on("child_added", (snap) => {
            let todoData = snap.val()
            todoData.id = snap.key
            let TodoObj = this.props.todos
            TodoObj = TodoObj.concat(todoData)
            this.props.rendering(TodoObj)

        })
        firebase.database().ref('todos/').on('child_changed', (data) => {
            let editedTodo = data.val();
            editedTodo.id = data.key;
            console.log(editedTodo)
            let todos = this.props.todos
            todos[this.state.editingIndex] = editedTodo
            this.props.rendering(todos)
        })
    }
    changeHandler(ev) {
        this.setState({
            todo: ev.target.value
        })
    }
    addTodo() {
        if (this.state.todo !== "") {
            let todo = {
                todo: this.state.todo
            }
            this.props.addingTodo(todo)
            this.setState({
                todo: ""
            })
        }
        else {
            alert("Enter Something to Add")
        }
    }
    editTodo(id, key, todo) {
        console.log("editing", id, key, todo)
        this.setState({
            editingState: true,
            editingTodo: todo,
            editingTodoId: id,
            editingIndex: key
        })

    }
    doneEditing() {
        firebase.database().ref('/').child("todos/" + this.state.editingTodoId).set({ todo: this.refs.update.value })
        this.setState({ editingState: false })
    }
    cancelEditing() {
        this.setState({ editingState: false })
    }
    deleteAlll() {
        this.props.deleteAll()
        console.log(this.props.todos)
    }
    deletingTodo(a, b) {
        firebase.database().ref('/').child("todos/" + a).remove()
        let todos = this.props.addedTodos;
        let afterDeleted = todos.slice(0, b).concat(todos.slice(b + 1))
        this.props.dataRender(afterDeleted)
    }
    // editingHandler(id, key, todo) {
    //     this.props.editingFunc(id, key, todo)
    // }
    render() {
        return (
            <div>
                <AppBar title="React and Redux Todo App"
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    style={{ textAlign: 'center' }} />

                <div>
                    {/* TURNERY OPERATOR HERE */}

                    {this.state.editingState !== true
                        ?
                        <div className="container">
                            <div className=" text-center">
                                <Paper style={{
                                    height: 'auto',
                                    width: "80%",
                                    margin: 50,
                                    textAlign: 'center',
                                    display: 'inline-block',
                                }} zDepth={1} >

                                    {/* MAIN TEXT FIELD */}

                                    <h1>What will you do today...?</h1>
                                    <TextField hintText="Add Todo"
                                        fullWidth={true}
                                        value={this.state.todo}
                                        onChange={this.changeHandler.bind(this)}
                                        required="required" />

                                    {/* MAIN BUTTONS */}

                                    <RaisedButton label="Add Todo" primary={true}
                                        style={{ margin: 10 }}
                                        onClick={this.addTodo.bind(this)} />
                                    <RaisedButton label="Delete All" primary={true}
                                        onClick={this.deleteAlll.bind(this)} />
                                </Paper>
                            </div>

                            {/* LIST COMPONENTS WORK */}

                            <div className="container row">
                                <div className="col-lg-3 col-md-3 col-sm-0"></div>
                                <div className="col-lg-6 col-md-6 col-sm-12">
                                    <h1 className="text-center listHead" style={{ color: "black" }}>LIST OF TODAY's WORK</h1>
                                    <ul className="list-group">
                                        {this.props.addedTodos.map((todo, key) => {
                                            return (
                                                <Paper style={{
                                                    height: 'auto',
                                                    width: "80%",
                                                    margin: 50,
                                                    textAlign: 'center',
                                                    display: 'inline-block',
                                                }} zDepth={1} >
                                                    <li className="list-group-item" key={key} id={todo.id}>
                                                        {todo.todo}
                                                        <hr />

                                                        {/* EDIT AND DELETE BUTTONS */}

                                                        <RaisedButton label="Delete" primary={true}
                                                            style={{ margin: 10, float: "right" }}
                                                            onClick={this.deletingTodo.bind(this, todo.id, key)} />

                                                        <RaisedButton label="Edit" primary={true}
                                                            style={{ margin: 10, float: "right" }}
                                                            onClick={this.editTodo.bind(this, todo.id, key, todo.todo)} />
                                                    </li>
                                                </Paper>

                                            )
                                        })
                                        }
                                    </ul>
                                    {/* <TodoList editiing={this.state.editingState} editingFunc={this.editTodo.bind(this)} /> */}
                                </div >
                            </div>

                        </div>

                        :
                        // UPDATING TODO WORKS
                        <div className="text-center">
                            <Paper style={{
                                height: 'auto',
                                width: "80%",
                                margin: 50,
                                textAlign: 'center',
                                display: 'inline-block',
                            }} zDepth={1} >
                                <h1> UPDATE TODO </h1>
                                {/* <TextField hintText={this.state.editingTodo} fullWidth={true} ref="update" /> */}

                                <input type="text" className="form-control" 
                                ref="update" placeholder={this.state.editingTodo} />

                                <RaisedButton label="Save" primary={true} 
                                style={{ margin: 10 }}
                                onClick={this.doneEditing.bind(this)} />
                                
                                <RaisedButton label="Cancel" primary={true}
                                onClick={this.cancelEditing.bind(this)} />
                            </Paper>

                        </div>
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProp(state) {
    return ({
        todos: state.root.todos,
        addedTodos: state.root.todos,
        editingState: state.root.editingState
    })
}
function mapDispatchToProp(dispatch) {
    return ({
        addingTodo: (addedTodo) => { dispatch(addingTodoAction(addedTodo)) },
        rendering: (todos) => { dispatch(renderingTodoAction(todos)) },
        deleteAll: () => { dispatch(deleteAllAction()) },
        dataRender: (finaltodo) => { dispatch(renderingTodoAction(finaltodo)) }


    })
}

export default connect(mapStateToProp, mapDispatchToProp)(AddTodo);