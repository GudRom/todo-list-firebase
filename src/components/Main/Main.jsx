import { useState, useContext, useEffect, useCallback } from "react";
import { Context } from "../..";
import Popup from "../Popup/Popup";
import TaskList from "../TaskList/TaskList";
import "./Main.css";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import Loader from "../Loader/Loader";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

function Main() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopup, setIsEditPopup] = useState(false);
  const [isTaskDone, setIsTaskDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [taskId, setTaskId] = useState("");
  const [filesURL, setFilesURL] = useState("");
  const [fileName, setFileName] = useState(null);

  const { db, storage } = useContext(Context);
  const tasksCollection = collection(db, "tasks");

  useEffect(() => {
    getTasks();
    // eslint-disable-next-line
  }, []);

  /**
   * Функция получения задач из БД
   * Делаем запрос к БД и записываем данные в стейт.
   */
  const getTasks = useCallback(() => {
    setIsLoading(true);
    const que = query(tasksCollection, orderBy("createdAt", "desc"));
    const data = onSnapshot(
      que,
      (querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ ...doc.data(), id: doc.id });
        });
        setTasks(items);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error geting document: ", error);
      }
    );
    return () => {
      data();
    };
  }, [tasksCollection]);

  /**
   * Функция создания задачи в БД
   * @param {string} title - заголовок задачи
   * @param {string} text - описание задачи
   * @param {string} date - дата выполнения задачи
   * @param {boolean} isTaskDone - состояние чекбокса (выполнена задача или нет)
   * @param {string} filesURL - сгенерированная ссылка на файл в Firebase Storage
   * @param {string} fileName - имя файла, в дальнейшем успользуется для удаления конкретного файла
   */
  const addTask = useCallback(
    async (title, text, date) => {
      try {
        await addDoc(tasksCollection, {
          title,
          text,
          isTaskDone,
          date,
          filesURL,
          fileName,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    },
    [fileName, filesURL, isTaskDone, tasksCollection]
  );

  /**
   * Функция обновления выполнения задачи в БД
   * @param {string} id - id задачи, нужна для правильного составления запроса на обновление состояния задачи
   * Передаем id для индетефикации задачи в БД
   * Получаем измененное состояние задачи
   */
  const updateTaskDone = useCallback(
    async (id) => {
      setIsTaskDone(!isTaskDone);
      try {
        const taskDoc = doc(db, "tasks", id);
        await updateDoc(taskDoc, {
          isTaskDone,
        });
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    },
    [db, isTaskDone]
  );

  /**
   * Функция обновления данных задачи в БД
   * @param {string} id - id задачи, нужна для правильного составления запроса на обновление данных задачи
   * Передаем id для индетефикации задачи в БД, также передаем остальные данные из формы редактирования
   */
  const updateTask = useCallback(async (id) => {
    try {
      const taskDoc = doc(db, "tasks", id);
      await updateDoc(taskDoc, {
        title,
        text,
        date,
        filesURL,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }, [date, db, filesURL, text, title]);

  /**
   * Функция удаления задачи из БД
   * @param {string} id - id задачи, нужна для правильного составления запроса на удаление задачи
   * @param {string} name - имя файла, передаем в функцию удаления в файла
   */
  const deleteTask = async (name, id) => {
    try {
      deleteFile(name);
      const taskDoc = doc(db, "tasks", id);
      await deleteDoc(taskDoc);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  /**
   * Функция открытия формы редактирования задачи
   * @param {string} title - заголовок задачи
   * @param {string} text - описание задачи
   * @param {string} date - дата выполнения задачи
   * @param {string} id - id задачи
   * Перед открытием попапа, предварительно заполняем поля
   */
  const editTask = (title, text, date, id) => {
    setIsEditPopup(true);
    setTitle(title);
    setText(text);
    setDate(date);
    setTaskId(id);
    setIsPopupOpen(true);
  };

  /**
   * Функция закрытия попапа
   */
  const closePopup = () => {
    setIsPopupOpen(false);
    setFilesURL("");
    if (isEditPopup) {
      setTitle("");
      setText("");
      setDate("");
      setTaskId("");
      setIsEditPopup(false);
    }
  };

  /**
   * Функция загрузки файлов в Firebase Storage
   * @param {object} e - событие, сробатывающее при добавлении файла в input
   * В случае успешного выполнения получаем ссылку на файл и фиксируем в стейте filesURl
   * Результат выполнения выводится в консоль
   */
  const uploadImages = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const storageRef = ref(storage, file.name);

    uploadBytes(storageRef, file)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
      })
      .then(() => {
        getDownloadURL(storageRef)
          .then((url) => {
            setFilesURL(url);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [storage]);
  /**
   * Функция удаления файла из Firebase Storage
   * @param {string} name - имя файла, нужно для правильного составления запроса на удаление файла из хранилища
   * Результат выполнения выводится в консоль
   */
  const deleteFile = useCallback((name) => {
    if (!name) return;
    const storageRef = ref(storage, name);
    deleteObject(storageRef)
      .then(() => {
        console.log("done");
      })
      .catch((error) => {
        console.log(error);
      });
  }, [storage]);

  return (
    <main className="main">
      <h1 className="main__title">Дела-дела:</h1>
      <button className="main__add-btn" onClick={() => setIsPopupOpen(true)}>
        Добавить
      </button>
      {isLoading ? <Loader /> : null}
      {tasks.length ? (
        <TaskList
          tasks={tasks}
          updateTaskDone={updateTaskDone}
          deleteTask={deleteTask}
          editTask={editTask}
        />
      ) : (
        <p>Добавь задачу</p>
      )}
      <Popup
        isPopupOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen}
        addTask={addTask}
        tasks={tasks}
        title={title}
        setTitle={setTitle}
        text={text}
        setText={setText}
        date={date}
        setDate={setDate}
        updateTask={updateTask}
        closePopup={closePopup}
        isEditPopup={isEditPopup}
        setIsEditPopup={setIsEditPopup}
        taskId={taskId}
        setTaskId={setTaskId}
        setFilesURL={setFilesURL}
        uploadImages={uploadImages}
      />
    </main>
  );
}

export default Main;
