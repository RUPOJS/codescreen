import { useState } from "react";
import Films from "../Films";

const Form = () => {
    const [enteredValue, setEnteredValue] = useState(``);
    const [directorName, setDirectorName] = useState(``);
    const [showError, setShowError] = useState(false);
    const handleInputTextChange = (event) => {
        console.log(event.target.value);
        setEnteredValue(event.target.value);
    };
    const handleFormSubmit = (event) => {
        event.preventDefault();
        setShowError(false);
        if (enteredValue === ``) {
            setShowError(true);
            return;
        }
        setDirectorName(enteredValue);
    }
    return (
        <div className="films-analysis-form-container">
            <form name="input-form" id="input-form" onSubmit={this.handleFormSubmit}>
                <input type="text" className={`${this.state.showError ? `director-name-input-box validation-error-input` : `director-name-input-box`}`} id="input-box" name="input-box" placeholder="Enter director name" onChange={this.handleInputTextChange}/>
                {this.state.showError && <small className="film-analysis-validation-err">Please enter a valid value</small>}
                <input type="submit" className="submit-button" value="SUBMIT" />
            </form>
            {this.state.directorName !== `` && <Films directorName={this.state.directorName} />}
        </div>
    );
};

export default Form;