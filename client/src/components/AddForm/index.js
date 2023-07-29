import { useState } from "react";

const AddForm = ({ type, handleSubmit, checkUser }) => {
  const [collapse, setCollapse] = useState(true);
  const [text, setText] = useState("");

  const toggle = () => setCollapse(!collapse);
  const handleOnSubmit = () => {
    toggle();
    handleSubmit(text)();
    setText("");
  };

  return (
    <div style={{ margin: "1rem 0" }}>
      {collapse && (
        <button
          onClick={() => {
            if (!checkUser()) return;
            toggle();
          }}
        >{`Add new ${type}`}</button>
      )}
      {!collapse ? (
        <div className={`add-${type.toLowerCase()}-form`}>
          <h3>{`Add a ${type}`}</h3>
          <div style={{ margin: "1rem 0" }}>
            <label>{`${type} : `}</label>
            <textarea
              rows={4}
              cols={50}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <button
            type="submit"
            onClick={handleOnSubmit}
            style={{ marginRight: "0.5rem" }}
          >
            Submit
          </button>
          <button
            type="reset"
            onClick={() => {
              setText("");
              toggle();
            }}
            style={{ marginLeft: "0.5rem" }}
          >
            Cancel
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default AddForm;
