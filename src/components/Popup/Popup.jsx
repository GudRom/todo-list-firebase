import Form from "../Form/Form";
import "./Popup.css";

function Popup(props) {

  return (
    <div className={`popup ${props.isPopupOpen ? "popup_open" : ""}`}>
      <div className="popup__content">
        <button
          className="popup__close-btn"
          onClick={() => props.closePopup()}
        >
          Закрыть
        </button>
        <p className="popup__title">Какие планы?</p>
        <Form
          addTask={props.addTask}
          tasks={props.tasks}
          setIsPopupOpen={props.setIsPopupOpen}          
          updateTask={props.updateTask}
          title={props.title}
          setTitle={props.setTitle}
          text={props.text}
          setText={props.setText}
          date={props.date}
          taskId={props.taskId}
          setTaskId={props.setTaskId}
          setDate={props.setDate}
          isEditPopup={props.isEditPopup}
          setIsEditPopup={props.setIsEditPopup}
          setFilesURL={props.setFilesURL}
          uploadImages={props.uploadImages}
        />
      </div>
    </div>
  );
}

export default Popup;
