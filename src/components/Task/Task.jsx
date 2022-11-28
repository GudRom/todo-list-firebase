import dayjs from "dayjs";
import { useEffect, useState } from "react";
import "./Task.css";

function Task(props) {
  const [isTimeOverduy, setIsTimeOverduy] = useState(false);
  const {
    title,
    text,
    date,
    id,
    filesURL,
    fileName,
    isTaskDone,
    updateTaskDone,
    deleteTask,
    editTask,
  } = props;

  const day = dayjs();

  /**
   * Функция контроля соблюдения сроков задачи
   * При определенных условиях включается таймер
   */
  useEffect(() => {
    const differenceSeconds = day.diff(date, "second");
    if (!date) return;
    if (differenceSeconds >= 0) {
      setIsTimeOverduy(true);
    } else if (differenceSeconds <= 300 && differenceSeconds < 0) {
      timer(differenceSeconds);
    } else {
      setIsTimeOverduy(false);
    }
  }, [day, date]);
  /**
   * Простой таймер
   * @param {number} seconds - время начала отсчета таймера
   */
  const timer = (seconds) => {
    const interval = setInterval(function () {
      if (seconds > 0) {
        setIsTimeOverduy(true);
        clearInterval(interval);
      }
      seconds += 1;
    }, 1000);
  };

  return (
    <li className="task">
      <details
        className={`task__block ${isTaskDone ? "task__block_done" : ""}`}
      >
        <summary className="task__summary">
          <input
            className="task__checkbox"
            type="checkbox"
            name="checkbox"
            id="checkbox"
            checked={isTaskDone}
            onChange={() => {
              updateTaskDone(id);
            }}
          />
          <div className="task__text-block">
            <p className="task__title">{title}</p>
            <p
              className={`task__time ${isTimeOverduy ? "task__time_red" : ""}`}
            >
              {dayjs(date).format("DD.MM.YYYY, HH:mm")}
            </p>
          </div>
          <div className="task__button-block">
            <button
              className="task__btn"
              onClick={() => {
                editTask(title, text, date, id);
              }}
            >
              Редактировать
            </button>
            <button
              className="task__btn task__btn_dlt"
              onClick={() => {
                deleteTask(fileName, id);
              }}
            >
              Удалить
            </button>
          </div>
        </summary>
        <div className="task__details">
          <p className="task__text">{text}</p>
          <p className="task__title">Вложенные файлы:</p>
          {filesURL ? (
            <img
              className="task__image"
              src={filesURL}
              alt={title}
              height={"150px"}
              width={"90px"}
            />
          ) : (
            <p>Пусто</p>
          )}
        </div>
      </details>
    </li>
  );
}

export default Task;
