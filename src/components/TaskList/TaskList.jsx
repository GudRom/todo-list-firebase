import Task from "../Task/Task";
import "./TaskList.css";

function TaskList(props) {
  return (
    <div className="tasks-block">
      <div className="tasks-block__text-block">
        <p className="tasks-block__text">Всего задач: {props.tasks.length}</p>
      </div>
      <ul className="tasks-block__list">
        {props.tasks.map((task) => {
          return (
            <Task
              key={task.id}
              {...task}
              updateTaskDone={props.updateTaskDone}
              deleteTask={props.deleteTask}
              editTask={props.editTask}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default TaskList;
