import React, { useEffect, useState } from "react";
import "./App.scss";
import { v4 as uuidv4 } from "uuid";

const url = "https://swapi.dev/api/people";
const createCharacter = (name) => {
  const id = uuidv4();
  return {
    name,
    id,
  };
};

function App() {
  const [characters, setCharacters] = useState([]);
  const [newCharacter, setNewCharacter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingID, setIsEditingID] = useState("");
  const [errorCantAdd, setErrorCantAdd] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const response = await fetch(url);
    const data = await response.json();
    setCharacters(
      data.results.map((result) => {
        return createCharacter(result.name);
      })
    );
    setIsLoading(false);
  };

  const handleDelete = (index) => {
    const newCharacters = characters.filter(
      (_, personIndex) => index !== personIndex
    );
    return setCharacters(newCharacters);
  };

  const handleEdit = (index) => {
    setIsEditingID(index);
  };

  const handleAdd = (name) => {
    if (newCharacter !== "") {
      setCharacters([...characters, createCharacter(name)]);
      setNewCharacter([]);
      setErrorCantAdd(false);
    } else setErrorCantAdd(true);
  };

  const handleSave = (currentCharacter, oldName, newName) => {
    setIsEditingID(null);
    setCharacters(
      characters.map((i) =>
        i.id === currentCharacter ? { ...i, name: newName } : i
      )
    );

    setCurrentCharacter(null);
  };

  const handleReset = loadData;

  const handleClear = () => {
    setCharacters([]);
  };

  return (
    <div className="App">
      {isLoading === true && <h3 className="loading">LOADING...</h3>}
      {isLoading === false && (
        <div>
          <h1 className="gold">STAR PEOPLE!</h1>
          <div className="character-list">
            {characters &&
              characters.map((person, index) => {
                return (
                  <div className="card" key={person.id}>
                    <div className="card-contents">
                      <h2>{person.name}</h2>
                      {isEditingID === person.id && (
                        <div>
                          <input
                            type="text"
                            name="name"
                            value={currentCharacter}
                            placeholder={person.name}
                            className="edit-input"
                            onChange={(e) =>
                              setCurrentCharacter(e.target.value)
                            }
                          ></input>

                          <button
                            onClick={(e) =>
                              handleSave(
                                person.id,
                                person.name,
                                currentCharacter
                              )
                            }
                          >
                            Save
                          </button>

                          <button
                            onClick={() =>
                              setIsEditingID(null) & setCurrentCharacter(null)
                            }
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      {(isEditingID === "" || isEditingID === null) && (
                        <div>
                          <button onClick={(e) => handleEdit(person.id)}>
                            Edit
                          </button>
                          <button onClick={(e) => handleDelete(index)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="new-character-form-wrapper">
            <div className="new-character-form">
              <label className="gold">Create a new character:</label>

              <input
                type="text"
                value={newCharacter}
                onChange={(e) =>
                  setErrorCantAdd(false) & setNewCharacter(e.target.value)
                }
              />
              <button onClick={(e) => handleAdd(newCharacter)}>Save</button>
              {errorCantAdd === true && (
                <h3 className="danger">Can't add a blank character!</h3>
              )}
              <div>
                <button onClick={handleReset}>Reset List</button>
              </div>
              <div>
                <button onClick={(e) => handleClear()}>Clear List</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
