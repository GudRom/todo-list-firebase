import "./Form.css";

function Form(props) {
  const {
    title,
    text,
    date,
    setIsPopupOpen,
    addTask,
    setTitle,
    setText,
    setDate,
    setIsEditPopup,
    isEditPopup,
    updateTask,
    taskId,    
    setTaskId,
    setFilesURL,    
    uploadImages
  } = props;

  const saveTask = (e) => {
    e.preventDefault();
    if (isEditPopup) {
      updateTask(taskId);
      setTaskId("");
      setFilesURL("");
    } else {
      addTask(title, text, date);
    }
    setIsPopupOpen(false);
    setIsEditPopup(false);
    setTitle("");
    setText("");
    setDate("");
  };

  return (
    <form className="form">
      <input
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        className="form__input form__input_title"
        type="text"
        name="title"
        id="title"
        placeholder="Заголовок"
      />
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        className="form__input form__input_description"
        name="description"
        id="description"
        cols="30"
        rows="10"
        placeholder="Описание"
      ></textarea>
      <input
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
        }}
        className="form__input form__input_datetime"
        type="datetime-local"
        name="datetime"
        id="datetime"
      />
      <input
        className="form__input-file"
        type="file"
        name="file"
        id="file"
        accept="image/jpeg, image/gif, image/png"
        onChange={(e) => uploadImages(e)}
      />
      <button className="form__save-btn" onClick={(e) => saveTask(e)}>
        Сохранить
      </button>
    </form>
  );
}

export default Form;
